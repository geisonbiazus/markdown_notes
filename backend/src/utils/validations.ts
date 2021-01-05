export class ValidationError {
  constructor(public field: string, public type: string) {}
}

export interface ValidationErrorResponse {
  status: 'validation_error';
  validationErrors: ValidationError[];
}

export function validationErrorResponse(
  validationErrors: ValidationError[]
): ValidationErrorResponse {
  return { status: 'validation_error', validationErrors };
}

export abstract class BaseValidator<TRequest> {
  public errors: ValidationError[] = [];

  constructor(private request: TRequest) {}

  protected abstract validate(): void;

  public isValid(): boolean {
    this.validate();
    return this.errors.length == 0;
  }

  protected validateRequired(field: keyof TRequest): void {
    const value = `${this.request[field] || ''}`;

    if (value == '') {
      this.errors.push(new ValidationError(field as string, 'required'));
    }
  }

  protected validateEmail(field: keyof TRequest): void {
    const value = `${this.request[field] || ''}`;

    if (value != '' && !value.includes('@')) {
      this.errors.push(new ValidationError(field as string, 'invalid_email'));
    }
  }
}
