import { PubSub } from '../utils';

export class AppContext {
  private pubSubInstance?: PubSub;

  public get pubSub(): PubSub {
    if (!this.pubSubInstance) this.pubSubInstance = new PubSub();
    return this.pubSubInstance;
  }
}
