# ASP.NET Core + React BFF Dev Proxy Sample app

This repo contains a sample app for hosting a React client from an ASP.NET Core WebAPI. During Development, requests for the client are forwarded to the vite development server, making the client application appear as if it was hosted through the server.

This enables the use of unified security headers in development and production, and allows us to use cookie authentication, as you'd use with a Razor/MVC or Blazor Server app.

## How to run

### development mode

1. Open the solution and launch the server app in Kestrel.
1. Run the client app at /src/Client by running `npm install` then `npm run dev`
1. Access the application at `localhost:5001`

### production mode

1. Build the client app at /src/Client by running `npm install` then `npm build`. The build output is placed in the server project's `wwwroot` folder
1. Build the solution, making sure the `wwwroot` folder is included in the build
1. Run the webAPI through Kestrel and access it via `https`
