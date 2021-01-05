import { ValidationError } from '../../utils/validations';
import { RegisterUserRequest } from '../interactors';
import { RegisterUserValidator } from './RegisterUserValidator';

describe('RegisterUserValidator', () => {
  const validRequest: RegisterUserRequest = { email: 'user@example.com', password: 'password123' };

  it('is valid when request is valid', () => {
    const validator = new RegisterUserValidator(validRequest);
    expect(validator.isValid()).toBeTruthy();
  });

  it('validates request and returns the errors', () => {
    assertInvalidRequest({}, 'email', 'required');
    assertInvalidRequest({ email: '' }, 'email', 'required');
    assertInvalidRequest({ email: 'invalid' }, 'email', 'invalid_email');

    assertInvalidRequest({}, 'password', 'required');
    assertInvalidRequest({ password: '' }, 'password', 'required');
  });
});

function assertInvalidRequest(request: RegisterUserRequest, field: string, type: string) {
  const validator = new RegisterUserValidator(request);
  expect(validator.isValid()).toBeFalsy();
  expect(validator.errors).toContainEqual(new ValidationError(field, type));
}
