import { HTTPClient, PubSub } from '../utils';
import { AppConfig, getAppConfig } from './AppConfig';

export class AppContext {
  private pubSubInstance?: PubSub;

  public get pubSub(): PubSub {
    if (!this.pubSubInstance) this.pubSubInstance = new PubSub();
    return this.pubSubInstance;
  }

  public get config(): AppConfig {
    return getAppConfig();
  }

  public get httpClient(): HTTPClient {
    return new HTTPClient(this.config.apiURL);
  }
}
