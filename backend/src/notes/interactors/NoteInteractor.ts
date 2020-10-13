import { Note } from '../entities';
import { InteractorResponse } from '../../utils/interactor';
import { SaveNoteValidator } from '../validators';

export interface Repository {
  getNoteById(id: string): Promise<Note | null>;
  saveNote(note: Note): Promise<void>;
  getNotesSortedByTitle(): Promise<Note[]>;
  removeNote(note: Note): Promise<void>;
}

export class NoteInteractor {
  constructor(private repo: Repository) {}

  public async saveNote(request: SaveNoteRequest): Promise<InteractorResponse<Note>> {
    const validator = new SaveNoteValidator(request);

    if (!validator.isValid()) return InteractorResponse.validationError(validator.errors);

    const note = new Note(request);
    await this.repo.saveNote(note);
    return InteractorResponse.success(note);
  }

  public async getNote(id: string): Promise<InteractorResponse<Note>> {
    const note = await this.repo.getNoteById(id);

    if (!note) return InteractorResponse.notFound<Note>();

    return InteractorResponse.success(note);
  }

  public async getNotes(): Promise<InteractorResponse<Note[]>> {
    const notes = await this.repo.getNotesSortedByTitle();

    return InteractorResponse.success(notes);
  }

  public async removeNote(id: string): Promise<InteractorResponse> {
    const note = await this.repo.getNoteById(id);

    if (!note) return InteractorResponse.notFound();

    await this.repo.removeNote(note);

    return InteractorResponse.success();
  }
}

export interface SaveNoteRequest {
  id?: string;
  title?: string;
  body?: string;
}
