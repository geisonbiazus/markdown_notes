import { Note } from '../entities';
import { InteractorResponse, QueryResponse } from './InteractorResponse';
import { SaveNoteValidator } from '../validators';

export interface Repository {
  getNoteById(id: string): Promise<Note | null>;
  saveNote(note: Note): Promise<void>;
  getNotesSortedTitle(): Promise<Note[]>;
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

  public async getNote(id: string): Promise<QueryResponse<Note>> {
    const note = await this.repo.getNoteById(id);

    if (!note) return QueryResponse.notFound<Note>();

    return QueryResponse.success(note);
  }

  public async getNotes(): Promise<QueryResponse<Note[]>> {
    const notes = await this.repo.getNotesSortedTitle();

    return QueryResponse.success(notes);
  }
}

export interface SaveNoteRequest {
  id?: string;
  title?: string;
  body?: string;
}

export class SaveNoteResponse extends InteractorResponse<SaveNoteRequest, Note> {}
