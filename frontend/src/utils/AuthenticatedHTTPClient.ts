import { HTTPClient, HTTPResponse } from './HTTPClient';

export class AuthenticatedHTTPClient extends HTTPClient {
  constructor(baseURL: string, private token: string, private onUnauthorized: () => void) {
    super(baseURL);
  }

  public async post<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return this.handleUnauthorized(await super.post(url, data, this.putAuthorization(headers)));
  }

  public async put<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return this.handleUnauthorized(await super.put(url, data, this.putAuthorization(headers)));
  }

  public async patch<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return this.handleUnauthorized(await super.patch(url, data, this.putAuthorization(headers)));
  }

  public async get<T>(url: string, headers: Record<string, string> = {}): Promise<HTTPResponse<T>> {
    return this.handleUnauthorized(await super.get<T>(url, this.putAuthorization(headers)));
  }

  public async delete<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return this.handleUnauthorized(await super.delete(url, data, this.putAuthorization(headers)));
  }

  private handleUnauthorized<T>(response: HTTPResponse<T>): HTTPResponse<T> {
    if (response.status === 401) this.onUnauthorized?.();
    return response;
  }

  private putAuthorization(headers: Record<string, string>): Record<string, string> {
    return { ...headers, Authorization: `Bearer ${this.token}` };
  }
}
