import { InteractorResponse } from '../../notes';
import { User } from '../entities';

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
  constructor(private repository: AuthenticationRepository, private tokenManager: TokenManager) {}

  async authenticate(
    email: string,
    password: string
  ): Promise<InteractorResponse<AuthenticateResponse>> {
    const user = this.repository.getUserByEmail(email);

    if (user?.password == password) {
      return InteractorResponse.success<AuthenticateResponse>({
        token: this.tokenManager.generateToken(user.id),
      });
    }

    return InteractorResponse.notFound();
  }
}
