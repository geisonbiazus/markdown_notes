import { Note } from '../entities';
import { InteractorResponse } from './InteractorResponse';
import { SaveNoteValidator } from '../validators';

export interface Repository {
  getNoteById(id: string): Promise<Note | null>;
  saveNote(note: Note): Promise<void>;
}

export class NoteInteractor {
  constructor(private repo: Repository) {}

  public async saveNote(request: SaveNoteRequest): Promise<SaveNoteResponse> {
    const validator = new SaveNoteValidator(request);

    if (!validator.isValid()) return SaveNoteResponse.error(validator.errors);

    const note = new Note(request);
    await this.repo.saveNote(note);
    return SaveNoteResponse.success(note);
  }
}

export interface SaveNoteRequest {
  id?: string;
  title?: string;
  body?: string;
}

export class SaveNoteResponse extends InteractorResponse<SaveNoteRequest, Note> {}
