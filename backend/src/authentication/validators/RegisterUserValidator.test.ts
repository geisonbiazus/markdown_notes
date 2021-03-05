import { ValidationError } from '../../utils/validations';
import { RegisterUserRequest } from '../useCases/RegisterUserUseCase';
import { RegisterUserValidator } from './RegisterUserValidator';

const validRequest: RegisterUserRequest = {
  name: 'User Name',
  email: 'user@example.com',
  password: 'password123',
};

describe('RegisterUserValidator', () => {
  it('is valid when request is valid', () => {
    const validator = new RegisterUserValidator(validRequest);
    expect(validator.isValid()).toBeTruthy();
  });

  it('validates request and returns the errors', () => {
    assertInvalidRequest({ email: '' }, 'email', 'required');
    assertInvalidRequest({ email: 'invalid' }, 'email', 'invalid_email');

    assertInvalidRequest({ password: '' }, 'password', 'required');
    assertInvalidRequest({ password: 'short' }, 'password', 'length', { minimum: 8 });

    assertInvalidRequest({ name: '' }, 'name', 'required');
  });
});

function assertInvalidRequest(
  partialRequest: Partial<RegisterUserRequest>,
  field: string,
  type: string,
  constraints?: Record<string, number | string>
) {
  const request = { ...validRequest, ...partialRequest };

  const validator = new RegisterUserValidator(request);
  expect(validator.isValid()).toBeFalsy();
  expect(validator.errors).toContainEqual(new ValidationError(field, type, constraints));
}
