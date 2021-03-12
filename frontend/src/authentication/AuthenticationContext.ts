import { AppConfig } from '../app/AppConfig';
import { HTTPClient } from '../utils/HTTPClient';
import { PubSub } from '../utils/pub_sub/PubSub';
import { APIAuthenticationClient } from './adapters/authenticationClient/APIAuthenticationClient';
import { InMemoryAuthenticationClient } from './adapters/authenticationClient/InMemoryAuthenticationClient';
import { AuthenticationClient } from './ports/AuthenticationClient';
import { SessionRepository } from './ports/SessionRepository';
import { ActivateUserStore } from './stores/ActivateUserStore';
import { SignInStore } from './stores/SignInStore';
import { SignUpStore } from './stores/SignUpStore';
import { LocalStorageSessionRepository } from './adapters/sessionRepository/LocalStorageSessionRepository';

export class AuthenticationContext {
  private signInStoreInstance?: SignInStore;
  private signUpStoreInstance?: SignUpStore;
  private activateUserStoreInstance?: ActivateUserStore;
  private authenticationClientInstance?: AuthenticationClient;

  constructor(private httpClient: HTTPClient, private pubSub: PubSub, private config: AppConfig) {}

  public get signInStore(): SignInStore {
    if (!this.signInStoreInstance) {
      this.signInStoreInstance = new SignInStore(
        this.authenticationClient,
        this.sessionRepository,
        this.pubSub
      );

      this.signInStoreInstance.checkAuthentication();
    }
    return this.signInStoreInstance;
  }

  public get signUpStore(): SignUpStore {
    if (!this.signUpStoreInstance) {
      this.signUpStoreInstance = new SignUpStore(this.authenticationClient);
    }
    return this.signUpStoreInstance;
  }

  public get activateUserStore(): ActivateUserStore {
    if (!this.activateUserStoreInstance) {
      this.activateUserStoreInstance = new ActivateUserStore(this.authenticationClient);
    }
    return this.activateUserStoreInstance;
  }

  public get sessionRepository(): SessionRepository {
    return new LocalStorageSessionRepository();
  }

  public get authenticationClient(): AuthenticationClient {
    if (!this.authenticationClientInstance) {
      this.authenticationClientInstance = this.config.devMode
        ? this.initializeInMemoryAuthenticationClient()
        : new APIAuthenticationClient(this.httpClient);
    }
    return this.authenticationClientInstance;
  }

  private initializeInMemoryAuthenticationClient(): InMemoryAuthenticationClient {
    const client = new InMemoryAuthenticationClient();
    client.addActiveUser('User', 'user@example.com', 'password123', 'token');
    return client;
  }
}
