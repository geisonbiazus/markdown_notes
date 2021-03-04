import { Note } from '../entities/Note';
import { NoteRepository } from '../ports/NoteRepository';

export class InMemoryNoteRepository implements NoteRepository {
  private notes: Record<string, Note> = {};

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes[id] || null;
  }

  async saveNote(note: Note): Promise<void> {
    this.notes[note.id] = note;
  }

  async getUserNotesSortedByTitle(userId: string): Promise<Note[]> {
    return Object.values(this.notes)
      .filter((note) => note.userId === userId)
      .sort((a, b) => (a.title < b.title && -1) || (a.title < b.title && 1) || 0);
  }

  async removeNote(note: Note): Promise<void> {
    delete this.notes[note.id];
  }

  private static singletonInstance?: InMemoryNoteRepository;

  public static get instance(): InMemoryNoteRepository {
    if (!this.singletonInstance) {
      this.singletonInstance = new InMemoryNoteRepository();
    }
    return this.singletonInstance;
  }
}
