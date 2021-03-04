import { createConnection } from 'typeorm';
import { AuthenticationContext } from './authentication';
import { Config } from './Config';
import { NotesFacade } from './notes/NotesFacade';
import { FakePublisher, Publisher, RabbitMQPubSub, Subscriber } from './utils/pub_sub';

export class AppContext {
  public config: Config;

  private authenticationContext?: AuthenticationContext;

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

  private notesFacade?: NotesFacade;

  public get notes(): NotesFacade {
    if (!this.notesFacade) {
      this.notesFacade = new NotesFacade(this.config);
    }
    return this.notesFacade;
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
