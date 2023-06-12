using AspNetCore.Proxy;
using Azure.Identity;
using ReactBffProxy.Server;
using ReactBffProxy.Server.Extensions;
using ReactBffProxy.Services;
using Serilog;

#pragma warning disable CA1305
#pragma warning disable CA1852 // Seal internal types
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.AzureApp()
    .CreateBootstrapLogger();
#pragma warning restore CA1852 // Seal internal types
#pragma warning restore CA1305

try
{
    Log.Information("Starting web host");

    var builder = WebApplication.CreateBuilder(args);

    builder.WebHost
        .ConfigureKestrel(serverOptions => { serverOptions.AddServerHeader = false; })
        .ConfigureAppConfiguration((_, configurationBuilder) =>
        {
            var config = configurationBuilder.Build();
            var azureKeyVaultEndpoint = config["AzureKeyVaultEndpoint"];
            if (!string.IsNullOrEmpty(azureKeyVaultEndpoint))
            {
                // Add Secrets from KeyVault
                Log.Information("Use secrets from {AzureKeyVaultEndpoint}", azureKeyVaultEndpoint);
                configurationBuilder.AddAzureKeyVault(new Uri(azureKeyVaultEndpoint), new DefaultAzureCredential(new DefaultAzureCredentialOptions
                {
                    VisualStudioTenantId = config["AzureAd:TenantId"],
                    VisualStudioCodeTenantId = config["AzureAd:TenantId"],
                    SharedTokenCacheTenantId = config["AzureAd:TenantId"],
                    InteractiveBrowserTenantId = config["AzureAd:TenantId"],
                    ExcludeEnvironmentCredential = true,
                    ExcludeManagedIdentityCredential = true,
                }));
            }
            else
            {
                // Add Secrets from UserSecrets for local development
                configurationBuilder.AddUserSecrets("8D552AC2-3F5E-437D-A29C-BE6101ED94EB");
            }
        });

    builder.Host.UseSerilog((context, loggerConfiguration) => loggerConfiguration.ReadFrom.Configuration(context.Configuration));

    var services = builder.Services;
    var configuration = builder.Configuration;
    var env = builder.Environment;

    builder.Services.AddInfrastructure()
    .AddSecurity(configuration)
    .AddSwagger(configuration)
    .AddScoped<MsGraphService>();

    if (env.IsDevelopment())
    {
        services.AddProxies();
    }

    var app = builder.Build();

    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();

        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            options.DisplayRequestDuration();
        });
    }
    else
    {
        app.UseExceptionHandler("/Error");
        app.UseHsts();
    }

    app.UseSecurityHeaders(
        SecurityHeadersDefinitions.GetHeaderPolicyCollection(env.IsDevelopment(),
            configuration["AzureAd:Instance"]));

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();

    app.UseNoUnauthorizedRedirect("/api");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapRazorPages();
    app.MapControllers();

    // SPA-specific routing

    app.MapNotFound("/api/{**segment}");

    if (env.IsDevelopment())
    {
        var spaDevServer = app.Configuration.GetValue<string>("SpaDevServerUrl");
        if (!string.IsNullOrEmpty(spaDevServer))
        {
            // proxy any requests that we think should go to the vite dev server
            app.MapWhen(
                context =>
                {
                    var path = context.Request.Path.ToString();
                    var isFileRequest = path.StartsWith("/@", StringComparison.InvariantCulture) // some libs
                    || path.StartsWith("/src", StringComparison.InvariantCulture) // source files
                    || path.StartsWith("/node_modules", StringComparison.InvariantCulture); // other libs

                    return isFileRequest;
                }, app => app.Run(context =>
                {
                    var targetPath = $"{spaDevServer}{context.Request.Path}{context.Request.QueryString}";
                    return context.HttpProxyAsync(targetPath);
                }));

        }
    }

    // handle urls that we think belong to the SPA routing
    app.MapFallbackToPage("/_Host");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
