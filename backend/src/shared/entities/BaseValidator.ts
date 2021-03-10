import { ValidationError } from './ValidationError';

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

  protected validateLength(field: keyof TRequest, constraints: LengthConstraints): void {
    const value = `${this.request[field] || ''}`;
    const { minimum } = constraints;

    if (minimum && value != '') {
      if (value.length < minimum) {
        this.errors.push(new ValidationError(field as string, 'length', { minimum }));
      }
    }
  }
}

export interface LengthConstraints {
  minimum?: number;
}
