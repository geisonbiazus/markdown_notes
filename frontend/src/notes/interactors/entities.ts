export interface Note {
  id: string;
  title: string;
  body: string;
}

export type ErrorType = 'required';
export type Errors = Record<string, ErrorType>;

export interface ValidationError {
  field: string;
  type: string;
}

export interface NoteClient {
  saveNote(note: Note): Promise<SaveNoteResponse>;
  getNote(id: string): Promise<Note | null>;
  getNotes(): Promise<Note[]>;
}

export interface SaveNoteResponse {
  status: 'success' | 'validation_error';
  note?: Note;
  errors?: ValidationError[];
}
