import {
  Errors,
  StateObservableInteractor,
  validateConfirmation,
  validateEmail,
  validateRequired,
} from '../../utils';

export interface SignUpState {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  errors: Errors;
}

export class SignUpInteractor extends StateObservableInteractor<SignUpState> {
  constructor() {
    super({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
    });
  }

  public setName(name: string): void {
    this.updateState({ name });
  }

  public setEmail(email: string): void {
    this.updateState({ email });
  }

  public setPassword(password: string): void {
    this.updateState({ password });
  }

  public setPasswordConfirmation(passwordConfirmation: string): void {
    this.updateState({ passwordConfirmation });
  }

  public async signUp(): Promise<void> {
    let errors: Errors = {};

    errors = validateRequired(errors, this.state, 'name');
    errors = validateRequired(errors, this.state, 'email');
    errors = validateRequired(errors, this.state, 'password');
    errors = validateRequired(errors, this.state, 'passwordConfirmation');
    errors = validateEmail(errors, this.state, 'email');
    errors = validateConfirmation(errors, this.state, 'password', 'passwordConfirmation');

    this.updateState({ errors });
  }
}
