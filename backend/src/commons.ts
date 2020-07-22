export class InteractorResponse<TParams, TEntity> {
  public status: 'error' | 'success';
  public data?: TEntity;
  public errors: ValidationError<TParams>[];

  constructor(params: {
    status: 'error' | 'success';
    data?: TEntity;
    errors?: ValidationError<TParams>[];
  }) {
    this.status = params.status;
    this.data = params.data;
    this.errors = params.errors || [];
  }
}

export class ValidationError<TParams> {
  constructor(public field: keyof TParams, public type: ValidationErrorType) {}
}

export type ValidationErrorType = 'required';
