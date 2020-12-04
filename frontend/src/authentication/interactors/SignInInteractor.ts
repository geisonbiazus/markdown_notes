import bind from 'bind-decorator';
import {
  Errors,
  isEmpty,
  validateRequired,
  StateBasedInteractor,
  StateManager,
  Publisher,
  StateObservableInteractor,
} from '../../utils';
import { AuthenticationClient, SessionRepository } from '../entities';

export interface SignInState {
  email: string;
  password: string;
  errors: Errors;
  token: string;
  authenticated: boolean;
}

export function newSignInState(initialState: Partial<SignInState> = {}): SignInState {
  return { email: '', password: '', errors: {}, token: '', authenticated: false, ...initialState };
}

export class SignInInteractor extends StateObservableInteractor<SignInState> {
  constructor(
    private authenticationClient: AuthenticationClient,
    private sessionRepository: SessionRepository,
    private publisher: Publisher
  ) {
    super(newSignInState());
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
    if (!this.validateState()) return;
    await this.performSignIn();
  }

  private validateState(): boolean {
    let errors: Errors = {};

    errors = validateRequired(errors, this.state, 'email');
    errors = validateRequired(errors, this.state, 'password');

    this.updateState({ errors });

    return isEmpty(errors);
  }

  private async performSignIn() {
    const token = await this.authenticationClient.signIn(this.state.email, this.state.password);

    if (!token) {
      this.updateStateToNotFound();
    } else {
      this.processSucessSignIn(token);
    }
  }

  private updateStateToNotFound(): void {
    this.updateState({ errors: { base: 'not_found' } });
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
    this.publisher.pusblish('user_authenticated', { token });
  }

  @bind
  public signOut() {
    this.sessionRepository.removeToken();
    this.updateState(newSignInState());
  }
}
