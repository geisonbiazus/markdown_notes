import { Note, NoteClient, SaveNoteResponse } from '../interactors';

export class InMemoryNoteClient implements NoteClient {
  private notes: Record<string, Note> = {};

  async saveNote(note: Note): Promise<SaveNoteResponse> {
    this.notes[note.id!] = note;
    return { status: 'success', note: note };
  }

  async getNote(id: string): Promise<Note | null> {
    return this.notes[id] || null;
  }

  async getNotes(): Promise<Note[]> {
    return Object.values(this.notes);
  }

  async removeNote(id: string): Promise<void> {
    delete this.notes[id];
  }
}
