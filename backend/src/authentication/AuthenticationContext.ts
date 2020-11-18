import { EntityManager, getConnection } from 'typeorm';
import { PasswordManager, TokenManager } from './entities';
import { EntityFactory } from './EntityFactory';
import { AuthenticationInteractor, AuthenticationRepository } from './interactors';
import { InMemoryAuthenticationRepository, TypeORMAuthenticationRepository } from './repositories';

export interface Config {
  env: string;
  authenticationTokenSecret: string;
  authenticationPasswordSecret: string;
}
export class AuthenticationContext {
  private authenticationRepo?: AuthenticationRepository;

  constructor(public config: Config) {}

  public get authenticationInteractor(): AuthenticationInteractor {
    return new AuthenticationInteractor(
      this.authenticationRepository,
      this.tokenManager,
      this.passwordManager
    );
  }

  public get authenticationRepository(): AuthenticationRepository {
    if (!this.authenticationRepo) {
      this.authenticationRepo = this.isTest
        ? new InMemoryAuthenticationRepository()
        : new TypeORMAuthenticationRepository(this.entityManager);
    }
    return this.authenticationRepo;
  }

  public get tokenManager(): TokenManager {
    return new TokenManager(this.config.authenticationTokenSecret);
  }

  public get passwordManager(): PasswordManager {
    return new PasswordManager(this.config.authenticationPasswordSecret);
  }

  public get entityFactory(): EntityFactory {
    return new EntityFactory(this.authenticationRepository, this.passwordManager);
  }

  private get isTest(): boolean {
    return this.config.env == 'test';
  }

  private get entityManager(): EntityManager {
    return getConnection().manager;
  }
}
