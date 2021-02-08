import { EntityManager, getConnection } from 'typeorm';
import { IDGenerator, UUIDGenerator } from '../utils/IDGenerator';
import { Publisher, Subscriber } from '../utils/pub_sub';
import { FakeEmailProvider, SendGridEmailProvider, TemplateIdsMap } from './adapters';
import { PasswordManager, TokenManager } from './entities';
import { EntityFactory } from './EntityFactory';
import { UserCreatedEvent } from './events';
import { AuthenticationInteractor, AuthenticationRepository, EmailProvider } from './interactors';
import { InMemoryAuthenticationRepository, TypeORMAuthenticationRepository } from './repositories';

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
  private authenticationRepo?: AuthenticationRepository;

  constructor(public config: Config, public publisher: Publisher, public subscriber: Subscriber) {}

  public get authenticationInteractor(): AuthenticationInteractor {
    return new AuthenticationInteractor(
      this.authenticationRepository,
      this.tokenManager,
      this.passwordManager,
      this.idGenerator,
      this.config.frontendAppURL,
      this.emailProvider,
      this.publisher
    );
  }

  public async startConsumers(): Promise<void> {
    await this.subscriber.subscribe<UserCreatedEvent>(
      'authentication',
      'user_created',
      (payload) => {
        this.authenticationInteractor.notifyUserActivation(payload.id);
      }
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
    return new EntityFactory(this.authenticationRepository, this.passwordManager);
  }

  public get idGenerator(): IDGenerator {
    return new UUIDGenerator();
  }

  private get isTest(): boolean {
    return this.config.env == 'test';
  }

  private get entityManager(): EntityManager {
    return getConnection().manager;
  }
}
