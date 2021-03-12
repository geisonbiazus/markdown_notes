import { ErrorResponse, ValidationErrorResponse } from '../shared/entities';

export interface Note {
  id: string;
  title: string;
  body: string;
  html: string;
}

export function newNote(params: Partial<Note> = {}): Note {
  return {
    id: '',
    title: '',
    body: '',
    html: '',
    ...params,
  };
}

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
