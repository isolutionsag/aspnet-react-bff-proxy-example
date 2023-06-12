import { WeatherForecast } from "../models/WeatherForecast";
import { HttpClient } from "./HttpClient";

export class TestService {
  public baseQueryKey = ["testService"];

  constructor(protected httpClient: HttpClient) {}

  public fetchData = () =>
    this.httpClient.get<WeatherForecast[]>("weatherforecast");

  public fetchDataQueryConfig = () => ({
    queryFn: this.fetchData,
    queryKey: this.baseQueryKey,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public fetchGraphData = () => this.httpClient.get<any>("graphapicalls");

  public fetchGraphDataQueryConfig = () => ({
    queryFn: this.fetchGraphData,
    queryKey: [...this.baseQueryKey, "graph"],
  });

  public postData = () => this.httpClient.post("weatherforecast", {});
}
