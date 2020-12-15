export class ValidationError {
  constructor(public field: string, public type: ValidationErrorType) {}
}

export type ValidationErrorType = 'required';
