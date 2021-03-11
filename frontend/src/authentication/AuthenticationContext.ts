import { AppConfig } from '../app/AppConfig';
import { HTTPClient } from '../utils/HTTPClient';
import { PubSub } from '../utils/pub_sub/PubSub';
import { APIAuthenticationClient } from './clients/APIAuthenticationClient';
import { InMemoryAuthenticationClient } from './clients/InMemoryAuthenticationClient';
import { AuthenticationClient, SessionRepository } from './entities';
import { ActivateUserInteractor } from './interactors/ActivateUserInteractor';
import { SignInInteractor } from './interactors/SignInInteractor';
import { SignUpInteractor } from './interactors/SignUpInteractor';
import { LocalStorageSessionRepository } from './repositories/LocalStorageSessionRepository';

export class AuthenticationContext {
  private signInInteractorInstance?: SignInInteractor;
  private signUpInteractorInstance?: SignUpInteractor;
  private activateUserInteractorInstance?: ActivateUserInteractor;
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

  public get signUpInteractor(): SignUpInteractor {
    if (!this.signUpInteractorInstance) {
      this.signUpInteractorInstance = new SignUpInteractor(this.authenticationClient);
    }
    return this.signUpInteractorInstance;
  }

  public get activateUserInteractor(): ActivateUserInteractor {
    if (!this.activateUserInteractorInstance) {
      this.activateUserInteractorInstance = new ActivateUserInteractor(this.authenticationClient);
    }
    return this.activateUserInteractorInstance;
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
