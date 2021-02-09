import { createConnection } from 'typeorm';
import { AuthenticationContext } from './authentication';
import { Config } from './Config';
import { NotesContext } from './notes';
import { FakePublisher, Publisher, RabbitMQPubSub, Subscriber } from './utils/pub_sub';

export class AppContext {
  public config: Config;

  private authenticationContext?: AuthenticationContext;
  private notesContext?: NotesContext;
  private pubSubInstance?: RabbitMQPubSub;

  constructor() {
    this.config = new Config();
  }

  public async initialize(): Promise<void> {
    await createConnection();
    await this.pubSub.connect();
  }

  public async startConsumers(): Promise<void> {
    await this.authentication.startConsumers();
  }

  public get authentication(): AuthenticationContext {
    if (!this.authenticationContext) {
      this.authenticationContext = new AuthenticationContext(
        this.config,
        this.publisher,
        this.pubSub
      );
    }
    return this.authenticationContext;
  }

  public get notes(): NotesContext {
    if (!this.notesContext) {
      this.notesContext = new NotesContext(this.config);
    }
    return this.notesContext;
  }

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

  private get isTest(): boolean {
    return this.config.env == 'test';
  }
}
