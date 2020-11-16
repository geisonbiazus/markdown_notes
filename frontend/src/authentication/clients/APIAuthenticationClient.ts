import { handleError, HTTPClient } from '../../utils';
import { AuthenticationClient } from '../entities';

export class APIAuthenticationClient implements AuthenticationClient {
  constructor(private httpClient: HTTPClient) {}

  public signIn = async (email: string, password: string): Promise<string | null> => {
    const response = await this.httpClient.post<SignInResponse>('/sign_in', { email, password });
    if (response.data.status === 'success') return response.data.token!;
    if (response.data.status === 'error' && response.data.type === 'not_found') {
      return null;
    }
    throw handleError(response);
  };
}

interface SignInResponse {
  status: 'success' | 'error';
  token?: string;
  type?: string;
}
