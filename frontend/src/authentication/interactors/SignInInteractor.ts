import bind from 'bind-decorator';
import { Errors, isEmpty, validateRequired, StateBasedInteractor, StateManager } from '../../utils';
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

export class SignInInteractor extends StateBasedInteractor<SignInState> {
  constructor(
    stateManager: StateManager<SignInState>,
    private authenticationClient: AuthenticationClient,
    private sessionRepository: SessionRepository
  ) {
    super(stateManager);
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
    this.updateState({ authenticated: true, token });
    this.sessionRepository.setToken(token);
  }

  public checkAuthentication(): void {
    const token = this.sessionRepository.getToken();

    this.updateState({ authenticated: !!token, token: token || '' });
  }

  @bind
  public signOut() {
    this.sessionRepository.removeToken();
    this.updateState(newSignInState());
  }
}
