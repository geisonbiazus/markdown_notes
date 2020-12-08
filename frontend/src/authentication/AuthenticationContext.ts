import { HTTPClient, PubSub } from '../utils';
import { APIAuthenticationClient } from './clients';
import { AuthenticationClient, SessionRepository } from './entities';
import { SignInInteractor } from './interactors';
import { LocalStorageSessionRepository } from './repositories';

export class AuthenticationContext {
  private signInInteractorInstance?: SignInInteractor;

  constructor(private httpClient: HTTPClient, private pubSub: PubSub) {}

  public get signInInteractor(): SignInInteractor {
    if (!this.signInInteractorInstance) {
      this.signInInteractorInstance = new SignInInteractor(
        this.authenticationClient,
        this.sessionRepository,
        this.pubSub
      );
    }
    return this.signInInteractorInstance;
  }

  public get sessionRepository(): SessionRepository {
    return new LocalStorageSessionRepository();
  }

  public get authenticationClient(): AuthenticationClient {
    return new APIAuthenticationClient(this.httpClient);
  }
}
