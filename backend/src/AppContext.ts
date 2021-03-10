import { createConnection } from 'typeorm';
import { AuthenticationContext } from './authentication/AuthenticationContext';
import { Config } from './Config';
import { NotesContext } from './notes/NotesContext';
import { FakePublisher } from './shared/adapters/pubSub/FakePublisher';
import { Publisher, Subscriber } from './shared/ports/PubSub';
import { RabbitMQPubSub } from './shared/adapters/pubSub/RabbitMQPubSub';

export class AppContext {
  public config: Config;

  constructor() {
    this.config = new Config();
  }

  public async initialize(): Promise<void> {
    await createConnection();
    await this.pubSub.connect();
  }

  public async startSubscribers(): Promise<void> {
    await this.authentication.startSubscribers();
  }

  private authenticationContext?: AuthenticationContext;

  public get authentication(): AuthenticationContext {
    if (!this.authenticationContext) {
      this.authenticationContext = new AuthenticationContext(
        this.config,
        this.publisher,
        this.subscriber
      );
    }
    return this.authenticationContext;
  }

  private notesContext?: NotesContext;

  public get notes(): NotesContext {
    if (!this.notesContext) {
      this.notesContext = new NotesContext(this.config);
    }
    return this.notesContext;
  }

  private pubSubInstance?: RabbitMQPubSub;

  public get pubSub(): RabbitMQPubSub {
    if (!this.pubSubInstance) {
      this.pubSubInstance = new RabbitMQPubSub(
        this.config.rabbitmqURL,
        this.config.rabbitmqExchange
      );
    }
    return this.pubSubInstance;
  }

  public get publisher(): Publisher {
    return this.isTest ? new FakePublisher() : this.pubSub;
  }

  public get subscriber(): Subscriber {
    return this.pubSub;
  }

  private get isTest(): boolean {
    return this.config.env == 'test';
  }
}
