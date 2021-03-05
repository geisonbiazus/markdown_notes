import { ErrorResponse, errorResponse } from '../../utils/ErrorResponse';
import { PasswordManager } from '../entities/PasswordManager';
import { TokenManager } from '../entities/TokenManager';
import { User } from '../entities/User';
import { AuthenticationRepository } from '../ports/AuthenticationRepository';

export class AuthenticateUseCase {
  constructor(
    private repository: AuthenticationRepository,
    private tokenManager: TokenManager,
    private passwordManager: PasswordManager
  ) {}

  public async run(email: string, password: string): Promise<AuthenticateResponse> {
    const user = await this.repository.getUserByEmail(email);

    if (!user) {
      return errorResponse('not_found');
    }

    if (!(await this.verifyPassword(user, password))) {
      return errorResponse('not_found');
    }

    if (user.isPending) {
      return errorResponse('pending_user');
    }

    return { status: 'success', token: this.tokenManager.encode(user.id) };
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    return await this.passwordManager.verifyPassword(user.password, password, user.email);
  }
}

export type AuthenticateResponse = AuthenticateSuccessResponse | ErrorResponse;

export interface AuthenticateSuccessResponse {
  status: 'success';
  token: string;
}
