import { IDGenerator } from '../utils/IDGenerator';
import { Publisher } from '../utils/pub_sub';
import { User } from './entities/User';
import { AuthenticationRepository } from './ports/AuthenticationRepository';
import { EmailProvider } from './ports/EmailProvider';
import { PasswordManager } from './ports/PasswordManager';
import { TokenManager } from './ports/TokenManager';
import { ActivateUserUseCase } from './useCases/ActivateUserUseCase';
import { AuthenticateResponse, AuthenticateUseCase } from './useCases/AuthenticateUseCase';
import { GetAuthenticatedUserUseCase } from './useCases/GetAuthenticatedUserUseCase';
import { NotifyUserActivationUseCase } from './useCases/NotifyUserActivationUseCase';
import {
  RegisterUserRequest,
  RegisterUserResponse,
  RegisterUserUseCase,
} from './useCases/RegisterUserUseCase';

export class AuthenticationFacade {
  constructor(
    private repository: AuthenticationRepository,
    private tokenManager: TokenManager,
    private passwordManager: PasswordManager,
    private idGenerator: IDGenerator,
    private publisher: Publisher,
    private frontendAppURL: string,
    private emailProvider: EmailProvider
  ) {}

  public authenticate(email: string, password: string): Promise<AuthenticateResponse> {
    return new AuthenticateUseCase(this.repository, this.tokenManager, this.passwordManager).run(
      email,
      password
    );
  }

  public getAuthenticatedUser(token: string): Promise<User | null> {
    return new GetAuthenticatedUserUseCase(this.repository, this.tokenManager).run(token);
  }

  public registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    return new RegisterUserUseCase(
      this.repository,
      this.passwordManager,
      this.idGenerator,
      this.publisher
    ).run(request);
  }

  public activateUser(token: string): Promise<boolean> {
    return new ActivateUserUseCase(this.repository, this.tokenManager).run(token);
  }

  public notifyUserActivation(userId: string): Promise<void> {
    return new NotifyUserActivationUseCase(
      this.repository,
      this.tokenManager,
      this.frontendAppURL,
      this.emailProvider
    ).run(userId);
  }
}
