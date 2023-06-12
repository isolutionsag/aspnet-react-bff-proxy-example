import { Button, Tooltip } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { getCookie } from "./getCookie";

export const Login = () => {
  const authContext = useContext(AuthContext);

  async function login() {
    authContext.signIn();
  }

  return (
    <>
      {!authContext.authData?.isAuthenticated ? (
        <Button color="inherit" onClick={login}>
          Login
        </Button>
      ) : (
        <form method="post" action="/api/Auth/Logout">
          <Tooltip title={`Logged in as: ${authContext.authData?.name}`}>
            <Button variant="text" type="submit" color="inherit">
              Logout
            </Button>
          </Tooltip>
          <input
            type="hidden"
            id="__RequestVerificationToken"
            name="__RequestVerificationToken"
            value={getCookie("XSRF-RequestToken")}
          ></input>
        </form>
      )}
    </>
  );
};
