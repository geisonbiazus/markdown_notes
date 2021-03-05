import { BaseValidator } from '../../utils/validations';
import { RegisterUserRequest } from '../useCases/RegisterUserUseCase';

export class RegisterUserValidator extends BaseValidator<RegisterUserRequest> {
  public validate(): void {
    this.validateRequired('name');
    this.validateRequired('email');
    this.validateEmail('email');
    this.validateRequired('password');
    this.validateLength('password', { minimum: 8 });
  }
}
