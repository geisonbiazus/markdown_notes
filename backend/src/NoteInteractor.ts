export class NoteInteractor {
  createNote(params: CreateNoteParams): CreateNoteResponse {
    if (!params.isValid()) {
      return {
        status: 'error',
        errors: params.errors,
      };
    }

    return {
      status: 'success',
      data: new Note(params),
    };
  }
}

export type CreateNoteResponse = InteractorResponse<CreateNoteParams, Note>;

export class CreateNoteParams {
  public id: string;
  public title: string;
  public body: string;
  public errors: ValidationError<CreateNoteParams>[] = [];

  constructor(params: { id?: string; title?: string; body?: string }) {
    this.id = params.id || '';
    this.title = params.title || '';
    this.body = params.body || '';
  }

  isValid(): boolean {
    if (this.id === '') {
      this.errors.push({ field: 'id', type: 'required' });
    }

    if (this.title === '') {
      this.errors.push({ field: 'title', type: 'required' });
    }

    return this.errors.length == 0;
  }
}

export class Note {
  public id: string;
  public title: string;
  public body: string;

  constructor(params: { id?: string; title?: string; body?: string }) {
    this.id = params.id || '';
    this.title = params.title || '';
    this.body = params.body || '';
  }
}

export interface InteractorResponse<TParams, TEntity> {
  status: 'error' | 'success';
  data?: TEntity;
  errors?: ValidationError<TParams>[];
}

export interface ValidationError<TParams> {
  field: keyof TParams;
  type: ValidationErrorType;
}

export type ValidationErrorType = 'required';
