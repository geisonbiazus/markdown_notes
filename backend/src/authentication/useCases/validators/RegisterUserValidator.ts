import { BaseValidator } from '../../../shared/entities/BaseValidator';
import { RegisterUserRequest } from '../RegisterUserUseCase';

export class RegisterUserValidator extends BaseValidator<RegisterUserRequest> {
  public validate(): void {
    this.validateRequired('name');
    this.validateRequired('email');
    this.validateEmail('email');
    this.validateRequired('password');
    this.validateLength('password', { minimum: 8 });
  }
}
