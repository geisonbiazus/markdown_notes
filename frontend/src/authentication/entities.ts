export type Token = string;

export interface AuthenticationClient {
  signIn(email: string, password: string): Promise<Token | null>;
}

export interface SessionRepository {
  setToken(token: Token): void;
  getToken(): string | null;
  removeToken(): void;
}
