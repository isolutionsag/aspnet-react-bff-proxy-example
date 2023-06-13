// the hashes for all fontsource imports need to be added to the CSP style directive
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import createCache from "@emotion/cache";
import { AuthContextProvider } from "./auth/AuthContextProvider";
import { router } from "./router";
import { ServiceContextProvider } from "./ServiceContextProvider";
import { getCookie } from "./getCookie";

// Get the nonce for emotion/MUI
const nonce = getCookie("CSP-Nonce");

const cache = createCache({
  key: `mui-emotion-prefix`,
  nonce,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      networkMode: "always", // needed for service-worker cached queries to fire
      refetchOnReconnect: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <ServiceContextProvider>
            <AuthContextProvider>
              <CssBaseline />
              <RouterProvider router={router} />
            </AuthContextProvider>
          </ServiceContextProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </CacheProvider>
  </React.StrictMode>
);
