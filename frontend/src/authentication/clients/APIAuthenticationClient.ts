import { handleError, HTTPClient } from '../../utils';
import { AuthenticationClient, SignInResponse, SignUpRequest, SignUpResponse } from '../entities';

export class APIAuthenticationClient implements AuthenticationClient {
  constructor(private httpClient: HTTPClient) {}
  signUp(request: SignUpRequest): Promise<SignUpResponse> {
    throw new Error('Method not implemented.');
  }

  public async signIn(email: string, password: string): Promise<SignInResponse> {
    const response = await this.httpClient.post<SignInAPIResponse>('/users/sign_in', {
      email,
      password,
    });
    if (response.status === 200) return { status: 'success', token: response.data.token! };
    if (response.status === 404) return { status: 'error', type: 'not_found' };
    if (response.status === 403) return { status: 'error', type: 'pending_user' };
    throw handleError(response);
  }
}

interface SignInAPIResponse {
  status: 'success' | 'error';
  token?: string;
  type?: string;
}
