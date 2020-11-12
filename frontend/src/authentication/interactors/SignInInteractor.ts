import { Errors, isEmpty, validateRequired, StateBasedInteractor, StateManager } from '../../utils';
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

export class SignInInteractor extends StateBasedInteractor<SignInState> {
  constructor(
    stateManager: StateManager<SignInState>,
    private authenticationClient: AuthenticationClient,
    private sessionRepository: SessionRepository
  ) {
    super(stateManager);
  }

  public setEmail = (email: string): void => {
    this.updateState({ email });
  };

  public setPassword = (password: string): void => {
    this.updateState({ password });
  };

  public signIn = async (): Promise<void> => {
    if (!this.validateState()) return;
    await this.performSignIn();
  };

  private validateState = (): boolean => {
    let errors: Errors = {};

    errors = validateRequired(errors, this.state, 'email');
    errors = validateRequired(errors, this.state, 'password');

    this.updateState({ errors });

    return isEmpty(errors);
  };

  private performSignIn = async () => {
    const token = await this.authenticationClient.signIn(this.state.email, this.state.password);

    if (!token) {
      this.updateStateToNotFound();
    } else {
      this.processSucessSignIn(token);
    }
  };

  private updateStateToNotFound = (): void => {
    this.updateState({ errors: { base: 'not_found' } });
  };

  private processSucessSignIn = (token: string): void => {
    this.updateState({ authenticated: true });
    this.sessionRepository.setToken(token);
  };

  public checkAuthentication = (): void => {
    const token = this.sessionRepository.getToken();

    this.updateState({ authenticated: !!token });
  };

  public signOut = () => {
    this.sessionRepository.removeToken();
    this.updateState(newSignInState());
  };
}
