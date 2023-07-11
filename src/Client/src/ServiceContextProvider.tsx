import { PropsWithChildren, useContext, useMemo } from "react";
import { ServiceContext, ServiceContextContent } from "./ServiceContext";
import { HttpClient } from "./services/HttpClient";
import { TestService } from "./services/TestService";
import { AuthService } from "./services/AuthService";

export const ServiceContextProvider = ({ children }: PropsWithChildren) => {
  const httpClient = useMemo(() => new HttpClient(), []);
  const services: ServiceContextContent = useMemo(
    () => ({
      test: new TestService(httpClient),
      auth: new AuthService(httpClient),
    }),
    [httpClient]
  );
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => useContext(ServiceContext);
