import store, { actions } from "@/store";
import axios, { AxiosInstance } from "axios";
import { setOAuthRedirectionHandler } from "esri/identity/IdentityManager";

class ApeServices {

  private http: AxiosInstance;

  constructor() {
    this.http = axios.create();
  }


  private async Get<T>(uri: string): Promise<T[]> {
    var result = await this.http.get(uri);
    if (result.status === 200)
      return result.data as T[];
    return null;
  }

  public async GetApe(skip: number = 0, take: number = 10): Promise<server.Ape[]> {
    let result = await this.Get<server.Ape>(`https://b3.tdstage.it/api/d/certificati?skip=${skip}&take=${take}`);

    actions.SetApe(store, result)
    return result;
  }
}

export const apeServices = new ApeServices();