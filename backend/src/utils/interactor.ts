export class InteractorResponse<T = undefined> {
  public status: 'error' | 'success' | 'validation_error';
  public data?: T;
  public type?: string;
  public validationErrors?: ValidationError[];

  constructor(params: {
    status: 'error' | 'success' | 'validation_error';
    data?: T;
    type?: string;
    validationErrors?: ValidationError[];
  }) {
    this.status = params.status;
    this.data = params.data;
    this.type = params.type;
    this.validationErrors = params.validationErrors;
  }

  static success<T>(data?: T): InteractorResponse<T> {
    return new InteractorResponse({ status: 'success', data });
  }

  static validationError<T>(validationErrors: ValidationError[]): InteractorResponse<T> {
    return new InteractorResponse({ status: 'validation_error', validationErrors });
  }

  static notFound<T>() {
    return new InteractorResponse<T>({ status: 'error', type: 'not_found' });
  }

  static error<T>(errorType: string) {
    return new InteractorResponse<T>({ status: 'error', type: errorType });
  }
}

export class ValidationError {
  constructor(public field: string, public type: ValidationErrorType) {}
}

export type ValidationErrorType = 'required';
