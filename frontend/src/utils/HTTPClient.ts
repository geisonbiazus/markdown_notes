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

  public async post<T>(url: string, data: any): Promise<HTTPResponse<T>> {
    return this.request('POST', url, data);
  }

  public async put<T>(url: string, data: any): Promise<HTTPResponse<T>> {
    return this.request('PUT', url, data);
  }

  public async patch<T>(url: string, data: any): Promise<HTTPResponse<T>> {
    return this.request('PATCH', url, data);
  }

  public async get<T>(url: string): Promise<HTTPResponse<T>> {
    return this.request('GET', url);
  }

  public async delete<T>(url: string): Promise<HTTPResponse<T>> {
    return this.request('DELETE', url);
  }

  public async request<T>(
    method: HTTPMethod,
    url: string,
    data: any = undefined
  ): Promise<HTTPResponse<T>> {
    try {
      const response = await this.axios.request<T>({ url, method, data });
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

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
