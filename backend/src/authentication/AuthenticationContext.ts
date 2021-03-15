import { getConnection } from 'typeorm';
import { UUIDGenerator } from '../shared/adapters/idGenerator/UUIDGenerator';
import { IDGenerator } from '../shared/ports/IDGenerator';
import { Publisher, Subscriber } from '../shared/ports/PubSub';
import { FakeEmailProvider } from './adapters/emailProviders/FakeEmailProvider';
import {
  SendGridEmailProvider,
  TemplateIdsMap,
} from './adapters/emailProviders/SendGridEmailProvider';
import { BcryptPasswordManager } from './adapters/passwordManager/BcryptPasswordManager';
import { InMemoryAuthenticationRepository } from './adapters/repositories/InMemoryAuthenticationRepository';
import { TypeORMAuthenticationRepository } from './adapters/repositories/TypeORMAuthenticationRepository';
import { JWTTokenManager } from './adapters/tokenManager/JWTTokenManager';
import { EntityFactory } from './EntityFactory';
import { AuthenticationRepository } from './ports/AuthenticationRepository';
import { EmailProvider } from './ports/EmailProvider';
import { startSubscribers } from './subscribers';
import { ActivateUserUseCase } from './useCases/ActivateUserUseCase';
import { AuthenticateUseCase } from './useCases/AuthenticateUseCase';
import { GetAuthenticatedUserUseCase } from './useCases/GetAuthenticatedUserUseCase';
import { NotifyUserActivationUseCase } from './useCases/NotifyUserActivationUseCase';
import { RegisterUserUseCase } from './useCases/RegisterUserUseCase';

export interface Config {
  env: string;
  authenticationTokenSecret: string;
  authenticationPasswordSecret: string;
  defaultEmailSender: string;
  sendgridApiKey: string;
  sendgridUserActivationTemplateId: string;
  frontendAppURL: string;
}

export class AuthenticationContext {
  constructor(public config: Config, public publisher: Publisher, public subscriber: Subscriber) {}

  public async startSubscribers(): Promise<void> {
    await startSubscribers(this);
  }

  public get authenticateUseCase(): AuthenticateUseCase {
    return new AuthenticateUseCase(this.repository, this.tokenManager, this.passwordManager);
  }

  public get getAuthenticatedUserUseCase(): GetAuthenticatedUserUseCase {
    return new GetAuthenticatedUserUseCase(this.repository, this.tokenManager);
  }

  public get registerUserUseCase(): RegisterUserUseCase {
    return new RegisterUserUseCase(
      this.repository,
      this.passwordManager,
      this.idGenerator,
      this.publisher
    );
  }

  public get activateUserUseCase(): ActivateUserUseCase {
    return new ActivateUserUseCase(this.repository, this.tokenManager);
  }

  public get notifyUserActivationUseCase(): NotifyUserActivationUseCase {
    return new NotifyUserActivationUseCase(
      this.repository,
      this.tokenManager,
      this.config.frontendAppURL,
      this.emailProvider
    );
  }

  private repositoryInstance?: InMemoryAuthenticationRepository;

  public get repository(): AuthenticationRepository {
    if (!this.isTest) return new TypeORMAuthenticationRepository(getConnection().manager);
    if (!this.repositoryInstance) this.repositoryInstance = new InMemoryAuthenticationRepository();
    return this.repositoryInstance;
  }

  public get tokenManager(): JWTTokenManager {
    return new JWTTokenManager(this.config.authenticationTokenSecret);
  }

  public get passwordManager(): BcryptPasswordManager {
    return new BcryptPasswordManager(this.config.authenticationPasswordSecret);
  }

  public get emailProvider(): EmailProvider {
    const templateIdsMap: TemplateIdsMap = {
      userActivation: this.config.sendgridUserActivationTemplateId,
    };

    return this.isTest
      ? new FakeEmailProvider()
      : new SendGridEmailProvider(
          this.config.sendgridApiKey,
          this.config.defaultEmailSender,
          templateIdsMap
        );
  }

  public get entityFactory(): EntityFactory {
    return new EntityFactory(this.repository, this.passwordManager);
  }

  public get idGenerator(): IDGenerator {
    return new UUIDGenerator();
  }

  private get isTest(): boolean {
    return this.config.env == 'test';
  }
}
