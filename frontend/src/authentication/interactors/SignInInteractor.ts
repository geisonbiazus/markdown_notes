import { Errors, isEmpty, validateRequired } from '../../utils';
import { AuthenticationClient, SessionRepository } from '../entities';

export interface SignInState {
  email: string;
  password: string;
  errors: Errors;
  authenticated: boolean;
}

export function newSignInState(initialState: Partial<SignInState> = {}): SignInState {
  return { email: '', password: '', errors: {}, authenticated: false, ...initialState };
}

export interface StateManager<T> {
  setState(state: T): void;
  getState(): T;
}

export class SignInInteractor {
  constructor(
    private stateManager: StateManager<SignInState>,
    private authenticationClient: AuthenticationClient,
    private sessionRepository: SessionRepository
  ) {}

  public setEmail(email: string): void {
    this.updateState({ email });
  }

  public setPassword(password: string): void {
    this.updateState({ password });
  }

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
    this.updateState({ authenticated: true });
    this.sessionRepository.setToken(token);
  }

  private get state(): SignInState {
    return this.stateManager.getState();
  }

  private updateState(update: Partial<SignInState>): void {
    this.stateManager.setState({ ...this.state, ...update });
  }
}
