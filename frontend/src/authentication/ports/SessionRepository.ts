export interface SessionRepository {
  setToken(token: string): void;
  getToken(): string | null;
  removeToken(): void;
}
