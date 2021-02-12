export interface ValidationError {
  field: string;
  type: string;
}

export interface ValidationErrorResponse {
  status: 'validation_error';
  errors: ValidationError[];
}

export interface ErrorResponse {
  status: 'error';
  type: string;
}
