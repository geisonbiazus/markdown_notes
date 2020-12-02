import { AuthenticatedHTTPClient, HTTPClient, PubSub } from '../utils';
import { AppConfig, getAppConfig } from './AppConfig';

export class AppContext {
  private pubSubInstance?: PubSub;
  private httpClientInstance?: HTTPClient;
  private authenticatedHTTPClientInstance?: AuthenticatedHTTPClient;

  public get pubSub(): PubSub {
    if (!this.pubSubInstance) this.pubSubInstance = new PubSub();
    return this.pubSubInstance;
  }

  public get config(): AppConfig {
    return getAppConfig();
  }

  public get httpClient(): HTTPClient {
    if (!this.httpClientInstance) {
      this.httpClientInstance = new HTTPClient(this.config.apiURL);
    }
    return this.httpClientInstance;
  }

  public get authenticatedHTTPClient(): AuthenticatedHTTPClient {
    if (!this.authenticatedHTTPClientInstance) {
      this.authenticatedHTTPClientInstance = new AuthenticatedHTTPClient(this.config.apiURL);
    }
    return this.authenticatedHTTPClientInstance;
  }
}
