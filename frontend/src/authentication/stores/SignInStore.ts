import bind from 'bind-decorator';
import { isEmpty } from '../../shared/utils/object';
import { Publisher } from '../../shared/ports/pubSub';
import { StateObservableStore } from '../../shared/stores/StateObservableStore';
import { Errors, validateRequired } from '../../shared/utils/validations';
import { AuthenticationClient } from '../ports/AuthenticationClient';
import { SessionRepository } from '../ports/SessionRepository';
import { USER_AUTHENTICATED_EVENT } from '../events';

export interface SignInState {
  email: string;
  password: string;
  errors: Errors;
  token: string;
  authenticated: boolean;
  pending: boolean;
}

function newSignInState(): SignInState {
  return { email: '', password: '', errors: {}, token: '', authenticated: false, pending: false };
}

export class SignInStore extends StateObservableStore<SignInState> {
  constructor(
    private authenticationClient: AuthenticationClient,
    private sessionRepository: SessionRepository,
    private publisher: Publisher
  ) {
    super(newSignInState());
  }

  @bind
  public cleanUp(): void {
    const { authenticated, token, ...newState } = newSignInState();
    this.updateState(newState);
  }

  @bind
  public setEmail(email: string): void {
    this.updateState({ email });
  }

  @bind
  public setPassword(password: string): void {
    this.updateState({ password });
  }

  @bind
  public async signIn(): Promise<void> {
    await this.withPendingState('pending', async () => {
      if (!this.validateState()) return;
      await this.performSignIn();
    });
  }

  private validateState(): boolean {
    let errors: Errors = {};

    errors = validateRequired(errors, this.state, 'email');
    errors = validateRequired(errors, this.state, 'password');

    this.updateState({ errors });

    return isEmpty(errors);
  }

  private async performSignIn() {
    const response = await this.authenticationClient.signIn(this.state.email, this.state.password);

    if (response.status === 'success') {
      this.processSucessSignIn(response.token);
    } else {
      this.updateState({ errors: { base: response.type } });
    }
  }

  private processSucessSignIn(token: string): void {
    this.sessionRepository.setToken(token);
    this.publishUserAuthenticatedEvent(token);
    this.updateState({ authenticated: true, token });
  }

  public checkAuthentication(): void {
    const token = this.sessionRepository.getToken();
    if (token) this.publishUserAuthenticatedEvent(token);
    this.updateState({ authenticated: !!token, token: token || '' });
  }

  private publishUserAuthenticatedEvent(token: string): void {
    this.publisher.publish(USER_AUTHENTICATED_EVENT, { token });
  }

  @bind
  public signOut() {
    this.sessionRepository.removeToken();
    this.updateState(newSignInState());
  }
}
