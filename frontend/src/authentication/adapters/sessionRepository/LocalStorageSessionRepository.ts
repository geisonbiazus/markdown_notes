import { SessionRepository } from '../../ports/SessionRepository';

const KEY_PREFIX = '_markdown_notes_';
const TOKEN_KEY = `${KEY_PREFIX}_token`;

export class LocalStorageSessionRepository implements SessionRepository {
  public setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
