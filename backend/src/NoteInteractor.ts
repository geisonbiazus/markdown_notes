import { Note } from './entities';
import { ValidationError, InteractorResponse } from './commons';

export interface Repository {
  getNoteById(id: string): Promise<Note | null>;
  createNote(note: Note): Promise<void>;
}

export class NoteInteractor {
  constructor(private repo: Repository) {}

  public async createNote(request: CreateNoteRequest): Promise<CreateNoteResponse> {
    request.validate();
    if (!request.isValid()) {
      return new CreateNoteResponse({
        status: 'error',
        errors: request.errors,
      });
    }

    const note = new Note(request);

    this.repo.createNote(note);

    return new CreateNoteResponse({
      status: 'success',
      data: note,
    });
  }
}

export interface CreateNoteRequestParams {
  id?: string;
  title?: string;
  body?: string;
}

export class CreateNoteRequest {
  public id: string;
  public title: string;
  public body: string;
  public errors: ValidationError<CreateNoteRequest>[] = [];

  constructor({ id = '', title = '', body = '' }: CreateNoteRequestParams) {
    this.id = id;
    this.title = title;
    this.body = body;
  }

  validate(): void {
    if (this.id === '') {
      this.errors.push(new ValidationError('id', 'required'));
    }

    if (this.title === '') {
      this.errors.push(new ValidationError('title', 'required'));
    }
  }

  isValid(): boolean {
    return this.errors.length == 0;
  }
}

export class CreateNoteResponse extends InteractorResponse<CreateNoteRequest, Note> {}
