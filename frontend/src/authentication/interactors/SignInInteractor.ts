import { ErrorType } from '../../notes';

export interface SignInState {
  email: string;
  password: string;
  errors: Record<string, ErrorType>;
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
    let updatedState = { ...state, errors: {} };
    updatedState = this.validateRequired(updatedState, 'email');
    updatedState = this.validateRequired(updatedState, 'password');

    return updatedState;
  }

  private validateRequired(state: SignInState, field: keyof SignInState): SignInState {
    if (!state[field].toString().trim()) {
      return { ...state, errors: { ...state.errors, [field]: 'required' } };
    }
    return state;
  }
}
