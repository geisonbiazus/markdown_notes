import { Errors, StateObservableInteractor, validateRequired } from '../../utils';

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

  public async signUp(): Promise<void> {
    let errors: Errors = {};

    errors = validateRequired(errors, this.state, 'name');
    errors = validateRequired(errors, this.state, 'email');
    errors = validateRequired(errors, this.state, 'password');
    errors = validateRequired(errors, this.state, 'passwordConfirmation');

    this.updateState({ errors });
  }
}
