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
    const state = this.stateManager.getState();
    this.stateManager.setState({ ...state, email });
  }

  public setPassword(password: string): void {
    const state = this.stateManager.getState();
    this.stateManager.setState({ ...state, password });
  }

  public async signIn(): Promise<void> {
    let state = this.stateManager.getState();

    state = this.validate(state);
    if (!isEmpty(state.errors)) {
      this.stateManager.setState(state);
      return;
    }

    const token = await this.authenticationClient.signIn(state.email, state.password);
    if (!token) {
      this.stateManager.setState(this.notFound(state));
    } else {
      this.sessionRepository.setToken(token);
      this.stateManager.setState({ ...state, authenticated: true });
    }
  }

  private validate(state: SignInState): SignInState {
    let errors: Errors = {};
    errors = validateRequired(errors, state, 'email');
    errors = validateRequired(errors, state, 'password');

    return { ...state, errors };
  }

  private notFound(state: SignInState): SignInState {
    return { ...state, errors: { base: 'not_found' } };
  }
}
