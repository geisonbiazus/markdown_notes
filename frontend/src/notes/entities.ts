export interface Note {
  id: string;
  title: string;
  body: string;
}

export interface NoteClient {
  saveNote(note: Note): Promise<SaveNoteResponse>;
  getNote(id: string): Promise<Note | null>;
  getNotes(): Promise<Note[]>;
  removeNote(id: string): Promise<void>;
}

export interface ValidationError {
  field: string;
  type: string;
}

export interface ValidationErrorResponse {
  status: 'validation_error';
  errors: ValidationError[];
}

export interface ErrorResponse {
  status: 'error';
  type: string;
}

export interface SuccessSaveNoteResponse {
  status: 'success';
  note: Note;
}

export type SaveNoteResponse = SuccessSaveNoteResponse | ErrorResponse | ValidationErrorResponse;
