export class NoteInteractor {
  createNote(params: CreateNoteParams): CreateNoteResponse {
    if (params.id == '' && params.title == '') {
      return {
        status: 'error',
        errors: [
          { field: 'id', type: 'required' },
          { field: 'title', type: 'required' },
        ],
      };
    }

    if (params.id == '') {
      return {
        status: 'error',
        errors: [{ field: 'id', type: 'required' }],
      };
    }

    if (params.title == '') {
      return {
        status: 'error',
        errors: [{ field: 'title', type: 'required' }],
      };
    }

    return {
      status: 'success',
      data: params,
    };
  }
}

export type CreateNoteResponse = InteractorResponse<CreateNoteParams, Note>;

export interface CreateNoteParams {
  id: string;
  title: string;
  body: string;
}

export interface Note {
  id: string;
  title: string;
  body: string;
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
