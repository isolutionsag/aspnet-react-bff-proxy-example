import axios, { AxiosInstance } from "axios";

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(xsrfToken: string) {
    this.axiosInstance = axios.create();
    this.axiosInstance.defaults.headers.common["X-XSRF-TOKEN"] = xsrfToken;
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
