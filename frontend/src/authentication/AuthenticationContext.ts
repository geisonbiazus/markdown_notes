import { AppConfig } from '../app';
import { HTTPClient, PubSub } from '../utils';
import { APIAuthenticationClient, InMemoryAuthenticationClient } from './clients';
import { AuthenticationClient, SessionRepository } from './entities';
import { SignInInteractor } from './interactors';
import { LocalStorageSessionRepository } from './repositories';

export class AuthenticationContext {
  private signInInteractorInstance?: SignInInteractor;
  private authenticationClientInstance?: AuthenticationClient;

  constructor(private httpClient: HTTPClient, private pubSub: PubSub, private config: AppConfig) {}

  public get signInInteractor(): SignInInteractor {
    if (!this.signInInteractorInstance) {
      this.signInInteractorInstance = new SignInInteractor(
        this.authenticationClient,
        this.sessionRepository,
        this.pubSub
      );

      this.signInInteractorInstance.checkAuthentication();
    }
    return this.signInInteractorInstance;
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
    client.addActiveUser('user@example.com', 'password123', 'token');
    return client;
  }
}
