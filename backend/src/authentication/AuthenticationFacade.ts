import { AuthenticationContext } from './AuthenticationContext';
import { User } from './entities/User';
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
  constructor(private context: AuthenticationContext) {}

  public authenticate(email: string, password: string): Promise<AuthenticateResponse> {
    return new AuthenticateUseCase(
      this.context.repository,
      this.context.tokenManager,
      this.context.passwordManager
    ).run(email, password);
  }

  public getAuthenticatedUser(token: string): Promise<User | null> {
    return new GetAuthenticatedUserUseCase(this.context.repository, this.context.tokenManager).run(
      token
    );
  }

  public registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    return new RegisterUserUseCase(
      this.context.repository,
      this.context.passwordManager,
      this.context.idGenerator,
      this.context.publisher
    ).run(request);
  }

  public activateUser(token: string): Promise<boolean> {
    return new ActivateUserUseCase(this.context.repository, this.context.tokenManager).run(token);
  }

  public notifyUserActivation(userId: string): Promise<void> {
    return new NotifyUserActivationUseCase(
      this.context.repository,
      this.context.tokenManager,
      this.context.config.frontendAppURL,
      this.context.emailProvider
    ).run(userId);
  }
}
