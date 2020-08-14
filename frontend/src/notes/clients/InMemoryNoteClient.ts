import { Note, NoteClient, SaveNoteResponse } from '../interactors';

export class InMemoryNoteClient implements NoteClient {
  private notes: Record<string, Note> = {};

  public async saveNote(note: Note): Promise<SaveNoteResponse> {
    this.notes[note.id!] = note;
    return { status: 'success', note: note };
  }

  public async getNote(id: string): Promise<Note | null> {
    return this.notes[id] || null;
  }
}
