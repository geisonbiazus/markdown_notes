import axios, { AxiosInstance, AxiosError } from 'axios';

export interface HTTPResponse<T> {
  data: T;
  status: number;
}

export class HTTPClient {
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({ baseURL: baseURL });
  }

  public async put<T>(url: string, data: any): Promise<HTTPResponse<T>> {
    try {
      const response = await this.axios.put<T>(url, data);
      return response;
    } catch (e) {
      const error = e as AxiosError<T>;
      if (error.response) return error.response;
      throw e;
    }
  }

  public static useNodeAdapter() {
    axios.defaults.adapter = require('axios/lib/adapters/http');
  }
}
