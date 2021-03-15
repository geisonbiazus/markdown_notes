import { TokenManager } from '../ports/TokenManager';

export class TokenManagerStub implements TokenManager {
  public token = 'token';
  public userId = 'userId';

  public encode(_userId: string): string {
    return this.token;
  }

  public decode(_token: string): string {
    return this.userId;
  }
}
