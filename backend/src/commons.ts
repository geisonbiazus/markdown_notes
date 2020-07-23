export class InteractorResponse<TRequest, TResponse> {
  public status: 'error' | 'success';
  public data?: TResponse;
  public errors: ValidationError<TRequest>[];

  constructor(params: {
    status: 'error' | 'success';
    data?: TResponse;
    errors?: ValidationError<TRequest>[];
  }) {
    this.status = params.status;
    this.data = params.data;
    this.errors = params.errors || [];
  }

  static success<TRequest, TResponse>(data: TResponse): InteractorResponse<TRequest, TResponse> {
    return new InteractorResponse({ status: 'success', data });
  }

  static error<TRequest, TResponse>(
    errors: ValidationError<TRequest>[]
  ): InteractorResponse<TRequest, TResponse> {
    return new InteractorResponse({ status: 'error', errors });
  }
}

export class ValidationError<TRequest> {
  constructor(public field: keyof TRequest, public type: ValidationErrorType) {}
}

export type ValidationErrorType = 'required';
