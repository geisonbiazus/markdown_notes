import { Errors, isEmpty, validateRequired } from '../../utils';
import { AuthenticationClient, SessionRepository } from '../entities';

export interface SignInState {
  email: string;
  password: string;
  errors: Errors;
  success: boolean;
}

export function newSignInState(initialState: Partial<SignInState> = {}): SignInState {
  return { email: '', password: '', errors: {}, success: false, ...initialState };
}

export class SignInInteractor {
  constructor(
    private authenticationClient: AuthenticationClient,
    private sessionRepository: SessionRepository
  ) {}

  public setEmail(state: SignInState, email: string): SignInState {
    return { ...state, email };
  }

  public setPassword(state: SignInState, password: string): SignInState {
    return { ...state, password };
  }

  public async signIn(state: SignInState): Promise<SignInState> {
    let updatedState = state;

    updatedState = this.validate(updatedState);
    if (!isEmpty(updatedState.errors)) return updatedState;

    const token = await this.authenticationClient.signIn(state.email, state.password);
    if (!token) return this.notFound(updatedState);

    this.sessionRepository.setToken(token);

    return { ...updatedState, success: true };
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
