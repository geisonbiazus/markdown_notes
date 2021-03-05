import { InvalidTokenError, TokenExpiredError, TokenManager } from '../entities/TokenManager';
import { User } from '../entities/User';
import { AuthenticationRepository } from '../ports/AuthenticationRepository';

export class GetAuthenticatedUserUseCase {
  constructor(private repository: AuthenticationRepository, private tokenManager: TokenManager) {}

  public async run(token: string): Promise<User | null> {
    try {
      const userId = this.tokenManager.decode(token);
      return await this.repository.getUserById(userId);
    } catch (e) {
      if (e instanceof InvalidTokenError) return null;
      if (e instanceof TokenExpiredError) return null;
      throw e;
    }
  }
}
