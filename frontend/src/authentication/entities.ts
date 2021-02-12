import { ErrorResponse } from '../shared/entitites';

export type Token = string;

export interface AuthenticationClient {
  signIn(email: string, password: string): Promise<SignInResponse>;
}

export type SignInResponse = SignInSuccessResponse | ErrorResponse;

export interface SignInSuccessResponse {
  status: 'success';
  token: string;
}

export interface SessionRepository {
  setToken(token: Token): void;
  getToken(): string | null;
  removeToken(): void;
}
