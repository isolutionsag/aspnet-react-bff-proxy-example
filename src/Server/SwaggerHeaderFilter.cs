using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ReactBffProxy.Server;

public class SwaggerHeaderFilter : IOperationFilter
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SwaggerHeaderFilter(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var cookieValue = _httpContextAccessor.HttpContext?.Request.Cookies["XSRF-RequestToken"];

        if (operation.Parameters == null)
            operation.Parameters = new List<OpenApiParameter>();

        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "X-XSRF-TOKEN",
            In = ParameterLocation.Header,
            Description = "CSRF request token",
            Required = false,
            Schema = new OpenApiSchema { Type = "string", Default = new OpenApiString(cookieValue) }
        });
    }
}

