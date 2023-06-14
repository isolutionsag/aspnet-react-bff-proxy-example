using System.Diagnostics;
using NetEscapades.AspNetCore.SecurityHeaders.Infrastructure;

namespace ReactBffProxy.Server;

public class SwaggerCspRelaxingHeaderService : CustomHeaderService
{
    private readonly IWebHostEnvironment _hostEnvironment;
    private readonly IConfiguration _configuration;

    public SwaggerCspRelaxingHeaderService(IWebHostEnvironment hostEnvironment, IConfiguration configuration)
    {
        _hostEnvironment = hostEnvironment;
        _configuration = configuration;
    }

    public override void ApplyResult(HttpResponse response, CustomHeadersResult result)
    {
        base.ApplyResult(response, result);
    }

    public override CustomHeadersResult EvaluatePolicy(HttpContext context, HeaderPolicyCollection policies)
    {
        var policiesToUse = policies;
        if (context.Request.Path.Value?.StartsWith("/swagger",StringComparison.InvariantCulture) ?? false)
        {
            policiesToUse = SecurityHeadersDefinitions.GetHeaderPolicyCollection(_hostEnvironment.IsDevelopment(), _configuration.GetValue<string>("AzureAd:Instance"), true);
        }
        
        return base.EvaluatePolicy(context,policiesToUse);
    }
}
