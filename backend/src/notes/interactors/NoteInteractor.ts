import { ValidationError } from '../../utils/validations';
import { MarkdownConverter, Note } from '../entities';
import { SaveNoteValidator } from '../validators';

export interface NoteRepository {
  getNoteById(id: string): Promise<Note | null>;
  saveNote(note: Note): Promise<void>;
  getNotesSortedByTitle(): Promise<Note[]>;
  removeNote(note: Note): Promise<void>;
}

export interface SaveNoteRequest {
  id?: string;
  title?: string;
  body?: string;
  userId: string;
}

export class NoteInteractor {
  constructor(private repo: NoteRepository, private markdownConverter: MarkdownConverter) {}

  public async saveNote(request: SaveNoteRequest): Promise<SaveNoteResponse> {
    const validator = new SaveNoteValidator(request);

    if (!validator.isValid()) return validationErrorResponse(validator.errors);

    const note = new Note(request);
    note.html = this.markdownConverter.convertToHTML(note.body);

    await this.repo.saveNote(note);

    return { status: 'success', note };
  }

  public async getNote(id: string): Promise<Note | null> {
    return await this.repo.getNoteById(id);
  }

  public async getNotes(): Promise<Note[]> {
    return await this.repo.getNotesSortedByTitle();
  }

  public async removeNote(id: string): Promise<boolean> {
    const note = await this.repo.getNoteById(id);

    if (!note) return false;

    await this.repo.removeNote(note);

    return true;
  }
}

export type SaveNoteResponse = SaveNoteSuccessResponse | ValidationErrorResponse;

export interface SaveNoteSuccessResponse {
  status: 'success';
  note: Note;
}

export interface ValidationErrorResponse {
  status: 'validation_error';
  validationErrors: ValidationError[];
}

function validationErrorResponse(validationErrors: ValidationError[]): ValidationErrorResponse {
  return { status: 'validation_error', validationErrors };
}
