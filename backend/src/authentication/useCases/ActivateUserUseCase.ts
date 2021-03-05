import { InvalidTokenError, TokenExpiredError, TokenManager } from '../entities/TokenManager';
import { User } from '../entities/User';
import { AuthenticationRepository } from '../ports/AuthenticationRepository';

export class ActivateUserUseCase {
  constructor(private repository: AuthenticationRepository, private tokenManager: TokenManager) {}

  public async run(token: string): Promise<boolean> {
    const user = await this.getUserFromToken(token);

    if (!user) return false;

    return await this.activatePendingUser(user);
  }

  private async getUserFromToken(token: string): Promise<User | null> {
    const userId = this.getUserIdFromToken(token);

    if (!userId) return null;

    return await this.repository.getUserById(userId);
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      return this.tokenManager.decode(token);
    } catch (e) {
      if (e instanceof InvalidTokenError) return null;
      if (e instanceof TokenExpiredError) return null;
      throw e;
    }
  }

  private async activatePendingUser(user: User): Promise<boolean> {
    if (!user.isPending) return false;

    user.status = 'active';
    await this.repository.saveUser(user);

    return true;
  }
}
