import {
  AuthenticationContext,
  UserAuthenticatedPayload,
  USER_AUTHENTICATED_EVENT,
} from '../authentication';
import { NoteContext } from '../notes/NoteContext';
import { AuthenticatedHTTPClient, HTTPClient, PubSub } from '../utils';
import { AppConfig, getAppConfig } from './AppConfig';

export class AppContext {
  private pubSubInstance?: PubSub;
  private authenticatedHTTPClientInstance?: AuthenticatedHTTPClient;
  private noteContextInstance?: NoteContext;
  private authenticationContextInstance?: AuthenticationContext;

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

  public get authenticatedHTTPClient(): AuthenticatedHTTPClient {
    if (!this.authenticatedHTTPClientInstance) {
      this.authenticatedHTTPClientInstance = new AuthenticatedHTTPClient(this.config.apiURL);
      this.authenticatedHTTPClientInstance.onUnauthorized(
        this.authenticationContext.signInInteractor.signOut
      );
    }
    return this.authenticatedHTTPClientInstance;
  }

  public get noteContext(): NoteContext {
    if (!this.noteContextInstance) {
      this.noteContextInstance = new NoteContext(this.authenticatedHTTPClient, this.pubSub);
    }
    return this.noteContextInstance;
  }

  public get authenticationContext(): AuthenticationContext {
    if (!this.authenticationContextInstance) {
      this.authenticationContextInstance = new AuthenticationContext(
        this.httpClient,
        this.pubSub,
        this.config
      );
    }
    return this.authenticationContextInstance;
  }

  public startSubscribers(): void {
    this.pubSub.subscribe(USER_AUTHENTICATED_EVENT, (payload: UserAuthenticatedPayload) => {
      this.authenticatedHTTPClient.setToken(payload.token);
    });
    this.noteContext.startSubscribers();
  }
}
