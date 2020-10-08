import { InteractorResponse } from '../../notes';
import { PasswordManager, User } from '../entities';

export interface AuthenticationRepository {
  getUserByEmail(email: string): User | null;
}

export interface TokenManager {
  generateToken(userId: string): string;
}

export interface AuthenticateResponse {
  token: string;
}

export class AuthenticationInteractor {
  constructor(
    private repository: AuthenticationRepository,
    private tokenManager: TokenManager,
    private passwordManager: PasswordManager
  ) {}

  async authenticate(
    email: string,
    password: string
  ): Promise<InteractorResponse<AuthenticateResponse>> {
    const user = this.repository.getUserByEmail(email);

    if (!user) return InteractorResponse.notFound();

    if (!(await this.verifyPassword(user, password))) return InteractorResponse.notFound();

    return InteractorResponse.success<AuthenticateResponse>({
      token: this.tokenManager.generateToken(user.id),
    });
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    return await this.passwordManager.verifyPassword(user.password, password, user.email);
  }
}
