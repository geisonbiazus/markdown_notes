import { handleError, HTTPClient } from '../../utils';
import {
  ActivateUserResponse,
  AuthenticationClient,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from '../entities';

export class APIAuthenticationClient implements AuthenticationClient {
  constructor(private httpClient: HTTPClient) {}

  public async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    const response = await this.httpClient.post<SignUpAPIResponse>('/users/register', request);

    if (response.status === 201) return { status: 'success' };
    if (response.status === 409) return { status: 'error', type: 'email_not_available' };
    throw handleError(response);
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

  public async activateUser(token: String): Promise<ActivateUserResponse> {
    throw new Error('Method not implemented.');
  }
}

interface SignUpAPIResponse {
  name?: string;
  email?: string;
  status?: string;
  type?: string;
}

interface SignInAPIResponse {
  token?: string;
  type?: string;
}
