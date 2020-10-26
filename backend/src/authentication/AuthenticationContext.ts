import { PasswordManager, TokenManager } from './entities';
import { EntityFactory } from './EntityFactory';
import { AuthenticationInteractor, AuthenticationRepository } from './interactors';
import { InMemoryAuthenticationRepository } from './repositories';

export class AuthenticationContext {
  private authenticationRepo?: AuthenticationRepository;

  public get authenticationInteractor(): AuthenticationInteractor {
    return new AuthenticationInteractor(
      this.authenticationRepository,
      this.tokenManager,
      this.passwordManager
    );
  }

  public get authenticationRepository(): AuthenticationRepository {
    if (!this.authenticationRepo) {
      this.authenticationRepo = new InMemoryAuthenticationRepository();
    }
    return this.authenticationRepo;
  }

  public get tokenManager(): TokenManager {
    return new TokenManager('secret');
  }

  public get passwordManager(): PasswordManager {
    return new PasswordManager('secret');
  }

  public get entityFactory(): EntityFactory {
    return new EntityFactory(this.authenticationRepository, this.passwordManager);
  }
}
