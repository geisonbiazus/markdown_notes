import { SessionRepository, Token } from '../entities';

export class InMemorySessionRepository implements SessionRepository {
  private token?: Token;

  public setToken(token: Token): void {
    this.token = token;
  }

  public getToken(): Token | null {
    return this.token || null;
  }
}
