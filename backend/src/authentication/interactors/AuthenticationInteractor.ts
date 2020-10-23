import { InteractorResponse } from '../../utils/interactor';
import {
  InvalidTokenError,
  PasswordManager,
  TokenExpiredError,
  TokenManager,
  User,
} from '../entities';

export interface AuthenticationRepository {
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
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
    const user = await this.repository.getUserByEmail(email);

    if (!user) return InteractorResponse.notFound();

    if (!(await this.verifyPassword(user, password))) return InteractorResponse.notFound();

    return InteractorResponse.success<AuthenticateResponse>({
      token: this.tokenManager.encode(user.id),
    });
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    return await this.passwordManager.verifyPassword(user.password, password, user.email);
  }

  public async getAuthenticatedUser(token: string): Promise<InteractorResponse<User>> {
    try {
      const userId = this.tokenManager.decode(token);
      const user = await this.repository.getUserById(userId);

      if (user) return InteractorResponse.success(user);

      return InteractorResponse.notFound();
    } catch (e) {
      if (e instanceof InvalidTokenError) return InteractorResponse.error('invalid_token');
      if (e instanceof TokenExpiredError) return InteractorResponse.error('token_expired');
      throw e;
    }
  }
}
