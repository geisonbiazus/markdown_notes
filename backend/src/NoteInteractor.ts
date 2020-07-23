import { Note } from './entities';
import { ValidationError, InteractorResponse } from './commons';

export interface Repository {
  getNoteById(id: string): Promise<Note | null>;
  saveNote(note: Note): Promise<void>;
}

export class NoteInteractor {
  constructor(private repo: Repository) {}

  public async saveNote(request: SaveNoteRequest): Promise<SaveNoteResponse> {
    if (!request.isValid()) return SaveNoteResponse.error(request.errors);

    const note = new Note(request);
    await this.repo.saveNote(note);
    return SaveNoteResponse.success(note);
  }
}

export interface SaveNoteRequestParams {
  id?: string;
  title?: string;
  body?: string;
}

export class SaveNoteRequest {
  public id: string;
  public title: string;
  public body: string;
  public errors: ValidationError<SaveNoteRequest>[] = [];

  constructor({ id = '', title = '', body = '' }: SaveNoteRequestParams) {
    this.id = id;
    this.title = title;
    this.body = body;
  }

  isValid(): boolean {
    if (this.id === '') {
      this.errors.push(new ValidationError('id', 'required'));
    }

    if (this.title === '') {
      this.errors.push(new ValidationError('title', 'required'));
    }

    return this.errors.length == 0;
  }
}

export class SaveNoteResponse extends InteractorResponse<SaveNoteRequest, Note> {}
