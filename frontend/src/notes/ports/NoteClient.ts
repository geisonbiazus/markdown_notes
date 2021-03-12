import { ErrorResponse, ValidationErrorResponse } from '../../shared/entities';
import { Note } from '../entitites/Note';

export interface NoteClient {
  saveNote(note: Note): Promise<SaveNoteResponse>;
  getNote(id: string): Promise<Note | null>;
  getNotes(): Promise<Note[]>;
  removeNote(id: string): Promise<void>;
}

export interface SuccessSaveNoteResponse {
  status: 'success';
  note: Note;
}

export type SaveNoteResponse = SuccessSaveNoteResponse | ErrorResponse | ValidationErrorResponse;
