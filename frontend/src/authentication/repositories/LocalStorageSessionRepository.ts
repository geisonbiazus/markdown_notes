import { SessionRepository, Token } from '../entities';

const KEY_PREFIX = '_markdown_notes_';
const TOKEN_KEY = `${KEY_PREFIX}_token`;

export class LocalStorageSessionRepository implements SessionRepository {
  public setToken(token: Token): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): Token | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
