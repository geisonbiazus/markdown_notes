import { HTTPClient, HTTPResponse } from './HTTPClient';

export class AuthenticatedHTTPClient extends HTTPClient {
  constructor(baseURL: string, private token: string) {
    super(baseURL);
  }

  public async post<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return super.post(url, data, this.putAuthorization(headers));
  }

  public async put<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return super.put(url, data, this.putAuthorization(headers));
  }

  public async patch<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return super.patch(url, data, this.putAuthorization(headers));
  }

  public async get<T>(url: string, headers: Record<string, string> = {}): Promise<HTTPResponse<T>> {
    return super.get(url, this.putAuthorization(headers));
  }

  public async delete<T>(
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HTTPResponse<T>> {
    return super.delete(url, data, this.putAuthorization(headers));
  }

  private putAuthorization(headers: Record<string, string>): Record<string, string> {
    return { ...headers, Autorization: `Bearer ${this.token}` };
  }
}
