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

  public async post<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.request({ method: 'POST', url, data, headers });
  }

  public async put<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.request({ method: 'PUT', url, data, headers });
  }

  public async patch<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.request({ method: 'PATCH', url, data, headers });
  }

  public async get<T>(url: string, headers?: Record<string, string>): Promise<HTTPResponse<T>> {
    return this.request({ method: 'GET', url, headers });
  }

  public async delete<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.request({ method: 'DELETE', url, data, headers });
  }

  public async request<T>(options: {
    method: HTTPMethod;
    url: string;
    headers?: Record<string, string>;
    data?: any;
  }): Promise<HTTPResponse<T>> {
    const { url, method, data, headers } = options;
    try {
      const response = await this.axios.request<T>({ url, method, data, headers });
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

export const handleError = <T>(response: HTTPResponse<T>) => {
  throw new Error(
    `Something went wrong. Status: ${response.status}. Body: ${JSON.stringify(response.data)}`
  );
};
