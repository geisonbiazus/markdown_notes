import { getConnection } from 'typeorm';
import { IDGenerator, UUIDGenerator } from '../utils/IDGenerator';
import { Publisher, Subscriber } from '../utils/pub_sub';
import { FakeEmailProvider } from './adapters/emailProviders/FakeEmailProvider';
import {
  SendGridEmailProvider,
  TemplateIdsMap,
} from './adapters/emailProviders/SendGridEmailProvider';
import { AuthenticationFacade } from './AuthenticationFacade';
import { PasswordManager } from './entities/PasswordManager';
import { TokenManager } from './entities/TokenManager';
import { EntityFactory } from './EntityFactory';
import { AuthenticationRepository } from './ports/AuthenticationRepository';
import { EmailProvider } from './ports/EmailProvider';
import { InMemoryAuthenticationRepository } from './adapters/repositories/InMemoryAuthenticationRepository';
import { TypeORMAuthenticationRepository } from './adapters/repositories/TypeORMAuthenticationRepository';
import { startSubscribers } from './subscribers';

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
    await startSubscribers(this.subscriber, this.facade);
  }

  public get facade(): AuthenticationFacade {
    return new AuthenticationFacade(this);
  }

  private repositoryInstance?: InMemoryAuthenticationRepository;

  public get repository(): AuthenticationRepository {
    if (!this.isTest) return new TypeORMAuthenticationRepository(getConnection().manager);
    if (!this.repositoryInstance) this.repositoryInstance = new InMemoryAuthenticationRepository();
    return this.repositoryInstance;
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
    return new EntityFactory(this.repository, this.passwordManager);
  }

  public get idGenerator(): IDGenerator {
    return new UUIDGenerator();
  }

  private get isTest(): boolean {
    return this.config.env == 'test';
  }
}
