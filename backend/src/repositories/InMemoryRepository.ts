import { Repository } from '../interactors/NoteInteractor';
import { Note } from '../entities/Note';

export class InMemoryRepository implements Repository {
  private notes: Record<string, Note> = {};

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes[id] || null;
  }

  async saveNote(note: Note): Promise<void> {
    this.notes[note.id] = note;
  }
}
