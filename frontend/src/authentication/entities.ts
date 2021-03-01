import { ErrorResponse, SuccessResponse } from '../shared/entitites';

export type Token = string;

export interface AuthenticationClient {
  activateUser(token: String): Promise<ActivateUserResponse>;
  signIn(email: string, password: string): Promise<SignInResponse>;
  signUp(request: SignUpRequest): Promise<SignUpResponse>;
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

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export type SignUpResponse = SuccessResponse | ErrorResponse;
export type ActivateUserResponse = SuccessResponse | ErrorResponse;
