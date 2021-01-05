import { BaseValidator } from '../../utils/validations';
import { RegisterUserRequest } from '../interactors';

export class RegisterUserValidator extends BaseValidator<RegisterUserRequest> {
  public validate(): void {
    this.validateRequired('email');
    this.validateEmail('email');
    this.validateRequired('password');
  }
}
