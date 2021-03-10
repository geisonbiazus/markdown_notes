import { ValidationError } from './ValidationError';

export interface ValidationErrorResponse {
  status: 'validation_error';
  validationErrors: ValidationError[];
}

export function validationErrorResponse(
  validationErrors: ValidationError[]
): ValidationErrorResponse {
  return { status: 'validation_error', validationErrors };
}
