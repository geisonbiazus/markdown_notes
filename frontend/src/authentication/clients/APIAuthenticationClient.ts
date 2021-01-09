import { handleError, HTTPClient } from '../../utils';
import { AuthenticationClient } from '../entities';

export class APIAuthenticationClient implements AuthenticationClient {
  constructor(private httpClient: HTTPClient) {}

  public signIn = async (email: string, password: string): Promise<string | null> => {
    const response = await this.httpClient.post<SignInResponse>('/users/sign_in', {
      email,
      password,
    });
    if (response.status === 200) return response.data.token!;
    if (response.status === 404) return null;
    throw handleError(response);
  };
}

interface SignInResponse {
  status: 'success' | 'error';
  token?: string;
  type?: string;
}
