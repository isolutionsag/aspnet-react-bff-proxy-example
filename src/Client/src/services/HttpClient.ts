import axios, { AxiosInstance } from "axios";
import { getCookie } from "../getCookie";

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
    this.axiosInstance.interceptors.request.use((config) => {
      // eslint-disable-next-line no-param-reassign
      config.headers["X-XSRF-TOKEN"] = getCookie("XSRF-RequestToken");
      return config;
    });
  }

  async get<TResponse, TParameters = unknown>(
    url: string,
    params?: TParameters
  ): Promise<TResponse> {
    return this.doGet<TResponse, TParameters>(url, params);
  }

  private async doGet<TResponse, TParameters>(
    url: string,
    params?: TParameters
  ): Promise<TResponse> {
    const response = await this.axiosInstance.get<TResponse>(
      `${HttpClient.getApiUrl()}${url}`,
      {
        params,
      }
    );
    return response.data;
  }

  async post<TResponse, TData>(url: string, data?: TData): Promise<TResponse> {
    const response = await this.axiosInstance.post<TResponse>(
      HttpClient.getApiUrl() + url,
      data
    );
    return response.data;
  }

  public static getApiUrl() {
    const backendHost = HttpClient.getCurrentHost();

    return `${backendHost}/api/`;
  }

  public static getCurrentHost() {
    const host = window.location.host;
    const url = `${window.location.protocol}//${host}`;
    return url;
  }
}
