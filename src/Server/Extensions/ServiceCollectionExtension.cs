using ReactBffProxy.Server;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using Microsoft.OpenApi.Models;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddOptions();
        services.AddHttpClient();
        services.AddHttpContextAccessor();

        services.AddControllersWithViews(options =>
            options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()));

        services.AddRazorPages()
            .AddMicrosoftIdentityUI();

        services.AddDistributedMemoryCache();

        return services;
    }

    public static IServiceCollection AddSecurity(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "X-XSRF-TOKEN";
            options.Cookie.Name = "__Host-X-XSRF-TOKEN";
            options.Cookie.SameSite = SameSiteMode.Strict;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        });

        var scopes = configuration.GetValue<string>("DownstreamApi:Scopes");
        var initialScopes = scopes!.Split(' ');

        services.AddMicrosoftIdentityWebAppAuthentication(configuration)
            .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
            .AddMicrosoftGraph(defaultScopes: scopes)
            .AddDistributedTokenCaches();

        services.AddAuthorization(options =>
        {
            options.AddPolicy(AuthorizationPolicies.AssignmentToDrinkReaderRoleRequired, policy => policy.RequireRole(AppRole.DrinkReader));
            options.AddPolicy(AuthorizationPolicies.AssignmentToDrinkWriterRoleRequired, policy => policy.RequireRole(AppRole.DrinkWriters));
            options.AddPolicy(AuthorizationPolicies.AssignmentToDrinkAdminRoleRequired, policy => policy.RequireRole(AppRole.DrinkAdmins));
        });

        services.AddHsts(options =>
        {
            options.Preload = true;
            options.IncludeSubDomains = true;
            options.MaxAge = TimeSpan.FromDays(60);
        });

        return services;
    }

    public static IServiceCollection AddSwagger(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSwaggerGen(options =>
        {
            options.OperationFilter<SwaggerHeaderFilter>();
            options.SwaggerDoc("v1",
                new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Asp.Net Core + React BFF API",
                    Description = "Asp.Net Core + React BFF API",
                    TermsOfService = new Uri(configuration["TermsOfServiceUrl"] ?? string.Empty)
                });
        });

        return services;
    }
}
