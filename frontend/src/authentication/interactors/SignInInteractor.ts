import { Errors, validateRequired } from '../../utils';

export interface SignInState {
  email: string;
  password: string;
  errors: Errors;
}

export function newSignInState(): SignInState {
  return { email: '', password: '', errors: {} };
}

export class SignInInteractor {
  public setEmail(state: SignInState, email: string): SignInState {
    return { ...state, email };
  }

  public setPassword(state: SignInState, password: string): SignInState {
    return { ...state, password };
  }

  public async signIn(state: SignInState): Promise<SignInState> {
    return this.validate(state);
  }

  private validate(state: SignInState): SignInState {
    let errors: Errors = {};
    errors = validateRequired(errors, state, 'email');
    errors = validateRequired(errors, state, 'password');

    return { ...state, errors };
  }
}
