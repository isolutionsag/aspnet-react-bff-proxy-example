import { PropsWithChildren, useContext } from "react";
import { Box } from "@mui/material";
import { AuthContext } from "./AuthContext";

interface AuthGuardProps extends PropsWithChildren {
  requiredRole?: string;
}

export const AuthGuard = ({ requiredRole, children }: AuthGuardProps) => {
  const authContext = useContext(AuthContext);
  const isSignedIn = authContext.authData?.isAuthenticated ?? false;
  const isAuthorized = !requiredRole || authContext.authData?.roles.includes(requiredRole);

  return (isSignedIn && isAuthorized) ? (
    <>{children}</>
  ) : (
    <Box pt={2}>Unauthorized - log in first or request the required roles</Box>
  );
};
