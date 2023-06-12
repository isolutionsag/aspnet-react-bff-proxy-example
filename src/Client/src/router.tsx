import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { Home } from "./Home";
import { Layout } from "./Layout";
import { ApiTest } from "./components/ApiTest";
import { AuthGuard } from "./auth/AuthGuard";
import { AdminComponent } from "./components/AdminComponent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/test",
        element: (
          <AuthGuard>
            <ApiTest />
          </AuthGuard>
        ),
      },
      {
        path: "/admin",
        element: (
          <AuthGuard requiredRole="Admin">
            <AdminComponent />
          </AuthGuard>
        ),
      },
    ],
  },
  {},
]);
