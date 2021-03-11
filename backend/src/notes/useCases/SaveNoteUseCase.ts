import {
  ValidationErrorResponse,
  validationErrorResponse,
} from '../../shared/entities/ValidationErrorResponse';
import { Note } from '../entities/Note';
import { MarkdownConverter } from '../ports/MarkdownConverter';
import { NoteRepository } from '../ports/NoteRepository';
import { SaveNoteValidator } from './validators/SaveNoteValidator';

export class SaveNoteUseCase {
  constructor(private repo: NoteRepository, private markdownConverter: MarkdownConverter) {}

  public async run(request: SaveNoteRequest): Promise<SaveNoteResponse> {
    const validator = new SaveNoteValidator(request);

    if (!validator.isValid()) return validationErrorResponse(validator.errors);

    const note = new Note(request);
    note.html = this.markdownConverter.convertToHTML(note.body);

    await this.repo.saveNote(note);

    return { status: 'success', note };
  }
}

export interface SaveNoteRequest {
  id?: string;
  title?: string;
  body?: string;
  userId: string;
}

export type SaveNoteResponse = SaveNoteSuccessResponse | ValidationErrorResponse;

export interface SaveNoteSuccessResponse {
  status: 'success';
  note: Note;
}
