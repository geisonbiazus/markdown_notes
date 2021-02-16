import bind from 'bind-decorator';
import {
  Errors,
  isEmpty,
  Publisher,
  StateObservableInteractor,
  validateConfirmation,
  validateEmail,
  validateRequired,
} from '../../utils';
import { AuthenticationClient } from '../entities';
import { UserSignedUpPayload, USER_SIGNED_UP_EVENT } from '../events';

export interface SignUpState {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  errors: Errors;
}

export class SignUpInteractor extends StateObservableInteractor<SignUpState> {
  constructor(private client: AuthenticationClient, private publisher: Publisher) {
    super({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
    });
  }

  @bind
  public setName(name: string): void {
    this.updateState({ name });
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
  public setPasswordConfirmation(passwordConfirmation: string): void {
    this.updateState({ passwordConfirmation });
  }

  @bind
  public async signUp(): Promise<void> {
    if (!this.validateState()) return;

    this.client.signUp({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    });

    this.publisher.publish<UserSignedUpPayload>(USER_SIGNED_UP_EVENT, {
      name: this.state.name,
      email: this.state.email,
    });
  }

  private validateState(): boolean {
    let errors: Errors = {};

    errors = validateRequired(errors, this.state, 'name');
    errors = validateRequired(errors, this.state, 'email');
    errors = validateRequired(errors, this.state, 'password');
    errors = validateRequired(errors, this.state, 'passwordConfirmation');
    errors = validateEmail(errors, this.state, 'email');
    errors = validateConfirmation(errors, this.state, 'password', 'passwordConfirmation');

    this.updateState({ errors });

    return isEmpty(errors);
  }
}
