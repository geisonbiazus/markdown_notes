import { SessionRepository } from '../../ports/SessionRepository';

export class InMemorySessionRepository implements SessionRepository {
  private token?: string;

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token || null;
  }

  public removeToken(): void {
    this.token = undefined;
  }
}
