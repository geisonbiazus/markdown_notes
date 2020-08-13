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

export class QueryResponse<T> {
  public status: 'success' | 'error';
  public data?: T;
  public type?: string;

  constructor(params: { status: 'success' | 'error'; data?: T; type?: string }) {
    this.status = params.status;
    this.data = params.data;
    this.type = params.type;
  }

  public static success<T>(data: T) {
    return new QueryResponse({ status: 'success', data: data });
  }

  public static notFound() {
    return new QueryResponse({ status: 'error', type: 'not_found' });
  }
}
