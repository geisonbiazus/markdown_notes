import bind from 'bind-decorator';
import { ErrorResponse } from '../../shared/entities';
import { isEmpty } from '../../utils/object';
import { StateObservableInteractor } from '../../utils/StateObservableInteractor';
import {
  Errors,
  validateConfirmation,
  validateEmail,
  validateMinimumLength,
  validateRequired,
} from '../../utils/validations';
import { AuthenticationClient, SignUpResponse } from '../ports/AuthenticationClient';

export interface SignUpState {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  errors: Errors;
  finished: boolean;
  pending: boolean;
}

export class SignUpStore extends StateObservableInteractor<SignUpState> {
  constructor(private client: AuthenticationClient) {
    super({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      finished: false,
      pending: false,
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
    await this.withPendingState('pending', async () => {
      if (!this.validateState()) return;
      await this.performSignUp();
    });
  }

  private validateState(): boolean {
    let errors: Errors = {};

    errors = validateRequired(errors, this.state, 'name');
    errors = validateRequired(errors, this.state, 'email');
    errors = validateRequired(errors, this.state, 'password');
    errors = validateRequired(errors, this.state, 'passwordConfirmation');
    errors = validateEmail(errors, this.state, 'email');
    errors = validateMinimumLength(errors, this.state, 'password', 8);
    errors = validateConfirmation(errors, this.state, 'password', 'passwordConfirmation');

    this.updateState({ errors });

    return isEmpty(errors);
  }

  private async performSignUp(): Promise<void> {
    const response = await this.performSignUpRequest();

    if (response.status === 'success') {
      this.updateState({ finished: true });
    } else {
      this.processErrorResponse(response);
    }
  }

  private async performSignUpRequest(): Promise<SignUpResponse> {
    return this.client.signUp({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    });
  }

  private processErrorResponse(response: ErrorResponse) {
    if (response.type === 'email_not_available') {
      this.updateState({ errors: { email: 'not_available' } });
    } else {
      console.log(response);
      throw new Error('Something went wrong');
    }
  }
}
