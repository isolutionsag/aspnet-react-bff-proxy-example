using System.Security.Claims;
using ReactBffProxy.Shared.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ReactBffProxy.Server.Controllers;

[ValidateAntiForgeryToken]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [IgnoreAntiforgeryToken]
    [HttpGet("Login")]
    public ActionResult Login(string? returnUrl, string? claimsChallenge)
    {
        var redirectUri = !string.IsNullOrEmpty(returnUrl) ? returnUrl : "/";

        var properties = new AuthenticationProperties { RedirectUri = redirectUri };

        if (claimsChallenge != null)
        {
            var jsonString = claimsChallenge.Replace("\\", "").Trim('"');

            properties.Items["claims"] = jsonString;
        }

        return Challenge(properties);
    }

    [Authorize]
    [HttpPost("Logout")]
    public ActionResult Logout()
    {
        return SignOut(
            new AuthenticationProperties { RedirectUri = "/" },
            CookieAuthenticationDefaults.AuthenticationScheme,
            OpenIdConnectDefaults.AuthenticationScheme);
    }

    [Authorize(Policy = AuthorizationPolicies.AssignmentToDrinkAdminRoleRequired)]
    [HttpGet("AdminInfo")]
    public ActionResult<string> GetAdminMock()
    {
        return Ok("Admin allowed");
    }

    [AllowAnonymous]
    [HttpGet("User")]
    public ActionResult<UserInfo> GetCurrentUser()
    {
        return Ok(CreateUserInfo(User));
    }

    private static UserInfo CreateUserInfo(ClaimsPrincipal claimsPrincipal)
    {
        if (!claimsPrincipal?.Identity?.IsAuthenticated ?? true)
        {
            return UserInfo.Anonymous;
        }

        var userInfo = new UserInfo { IsAuthenticated = true };

        if (claimsPrincipal?.Identity is ClaimsIdentity claimsIdentity)
        {
            userInfo.NameClaimType = claimsIdentity.NameClaimType;
            userInfo.RoleClaimType = claimsIdentity.RoleClaimType;
        }
        else
        {
            userInfo.NameClaimType = ClaimTypes.Name;
            userInfo.RoleClaimType = ClaimTypes.Role;
        }

        if (claimsPrincipal?.Claims?.Any() ?? false)
        {
            // Add just the name claim
            var claims = claimsPrincipal
                .FindAll(i => i.Type == userInfo.NameClaimType || i.Type == userInfo.RoleClaimType)
                .Select(claim => new ClaimValue(claim.Type, claim.Value))
                .ToList();

#pragma warning disable S125
            // Uncomment this code if you want to send additional claims to the client.
            // var claims = claimsPrincipal.Claims.Select(u => new ClaimValue(u.Type, u.Value)).ToList();
#pragma warning restore S125

            userInfo.Claims = claims;
        }

        return userInfo;
    }
}
