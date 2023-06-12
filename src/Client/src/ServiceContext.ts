import React from "react";
import { TestService } from "./services/TestService";
import { AuthService } from "./services/AuthService";

export interface ServiceContextContent {
  test: TestService;
  auth: AuthService;
}

export const ServiceContext = React.createContext<ServiceContextContent>(
  {} as ServiceContextContent
);
