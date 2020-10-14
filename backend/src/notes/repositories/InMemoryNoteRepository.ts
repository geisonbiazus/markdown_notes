import { NoteRepository } from '../interactors/NoteInteractor';
import { Note } from '../entities/Note';

export class InMemoryNoteRepository implements NoteRepository {
  private notes: Record<string, Note> = {};

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes[id] || null;
  }

  async saveNote(note: Note): Promise<void> {
    this.notes[note.id] = note;
  }

  async getNotesSortedByTitle(): Promise<Note[]> {
    return Object.values(this.notes).sort(
      (a, b) => (a.title < b.title && -1) || (a.title < b.title && 1) || 0
    );
  }

  async removeNote(note: Note): Promise<void> {
    delete this.notes[note.id];
  }
}
