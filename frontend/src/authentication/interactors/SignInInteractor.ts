import { Errors, isEmpty, validateRequired } from '../../utils';
import { AuthenticationClient, SessionRepository } from '../entities';

export interface SignInState {
  email: string;
  password: string;
  errors: Errors;
}

export function newSignInState(initialState: Partial<SignInState> = {}): SignInState {
  return { email: '', password: '', errors: {}, ...initialState };
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

    updatedState = { ...updatedState, errors: { base: 'not_found' } };

    return updatedState;
  }

  private validate(state: SignInState): SignInState {
    let errors: Errors = {};
    errors = validateRequired(errors, state, 'email');
    errors = validateRequired(errors, state, 'password');

    return { ...state, errors };
  }
}
