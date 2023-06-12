import { LinearProgress } from "@mui/material";
import {
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthData } from "../models/AuthData";
import { AuthContext } from "./AuthContext";
import { useErrorHandledQuery } from "../services/useErrorHandledQuery";
import { useServices } from "../ServiceContextProvider";

export const AuthContextProvider = ({
  children,
}: PropsWithChildren<unknown>): ReactElement => {
  const authContext = useContext(AuthContext);
  const [authData, setAuthData] = useState<AuthData | undefined>(
    authContext.authData
  );

  const { auth } = useServices();

  const query = useErrorHandledQuery(
    auth.fetchAuthDataQueryConfig(),
    "Could not fetch user data"
  );

  useEffect(() => {
    if (query.isSuccess) {
      const user: AuthData = query.data;

      user.name =
        user.claims.find((c) => c.type === user.nameClaimType)?.value ||
        "unknown";

      user.roles =
        user.claims.filter((c) => c.type === user.roleClaimType).map(c => c.value) ||
        [];

      if (!user.isAuthenticated) {
        setAuthData({
          isAuthenticated: false,
          claims: [],
          name: "",
          nameClaimType: "",
          roleClaimType: "",
          roles: []
        });
      } else {
        setAuthData(user);
      }
    }
  }, [query.data, query.isSuccess]);

  function signIn() {
    document.location.href = "/api/Auth/Login";
  }

  function signOut() {
    // TODO: create an axios default that adds this header to all requests
    // const xsrfToken = (document.querySelector('meta[name="XSRF-requestToken"]') as HTMLMetaElement)?.content;
    // const headers = {
    //   'X-XSRF-TOKEN': xsrfToken
    // }
    // axios.post('api/Auth/Logout', {}, { headers});
  }

  return (
    <>
      {authData != null ? (
        <AuthContext.Provider value={{ authData, signIn, signOut }}>
          {children}
        </AuthContext.Provider>
      ) : (
        <LinearProgress />
      )}
    </>
  );
};
