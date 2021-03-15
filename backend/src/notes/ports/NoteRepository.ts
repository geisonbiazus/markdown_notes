import { Note } from '../entities/Note';

export interface NoteRepository {
  getNoteById(id: string): Promise<Note | null>;
  saveNote(note: Note): Promise<void>;
  getUserNotesSortedByTitle(userId: string): Promise<Note[]>;
  removeNote(note: Note): Promise<void>;
}
