import { createContext } from "react";
import { AuthData } from "../models/AuthData";

export interface AuthContextContent {
  authData?: AuthData;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextContent>({
  authData: undefined,
  signIn: () => undefined,
  signOut: () => undefined,
});
