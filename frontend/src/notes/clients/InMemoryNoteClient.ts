import { SaveNoteClientFn, Note } from '../core';

export class InMemoryNoteClient {
  private notes: Record<string, Note> = {};

  saveNote: SaveNoteClientFn = async (note) => {
    this.notes[note.id!] = note;
    return { status: 'success', note: note };
  };

  getNoteById = async (id: string): Promise<Note | null> => {
    return this.notes[id] || null;
  };
}
