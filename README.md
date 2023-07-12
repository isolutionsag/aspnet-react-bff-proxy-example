# ASP.NET Core + React BFF Dev Proxy Sample app

This repo contains a sample app for hosting a React client from an ASP.NET Core WebAPI. During Development, requests for the client are forwarded to the vite development server, making the client application appear as if it was hosted through the server.

This enables the use of unified security headers in development and production, and allows us to use cookie authentication, as you'd use with a Razor/MVC or Blazor Server app.

## Points of Interest:

- AAD Config:
  - `ServiceCollectionExtension.cs` ~L43ff. Configures cookie auth
- Dev Server Proxy:
  - `Program.cs` ~L106ff
  - `_Host.cshtml`
- Security Headers + CSP with Nonce:
  - `SecurityHeadersDefinitions.cs`
- Reading the Nonce in Client app:
  - `main.tsx`
- CSP Workaround for Swagger:
  - `SwaggerCspRelaxingHeaderService.cs`
- XSRF/CSRF Mitigation with Synchronizer Pattern:
  - `_Host.cshtml` - create tokens and pass then through cookies (one HTML-only, one not)
  - `HttpClient.ts` - read request token from non-HTML-only cookie, add to header
- Swagger with CSRF:
  - `ServiceCollectionExtension.cs` ~L65ff
  - `SwaggerHeaderFilter.cs` - automatically add antiforgery request token (check swagger, it's shown as a form field)
- PWA:
  - `vite.config.ts` - contains Vite-PWA config
  - `service-worker.js` - basic offline support

## How to run

### development mode

1. Open the solution and launch the server app in Kestrel.
1. Run the client app at /src/Client by running `npm install` then `npm run dev`
1. Access the application at `localhost:5001`

### production mode

1. Build the client app at /src/Client by running `npm install` then `npm build`. The build output is placed in the server project's `wwwroot` folder
1. Build the solution, making sure the `wwwroot` folder is included in the build
1. Run the webAPI through Kestrel and access it via `https`
