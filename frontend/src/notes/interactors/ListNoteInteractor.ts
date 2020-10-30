import { Note, NoteClient } from '../entities';

export interface ListNoteState {
  notes: Note[];
}

export const newListNoteState = (): ListNoteState => {
  return { notes: [] };
};

export class ListNoteInteractor {
  constructor(public noteClient: NoteClient) {}

  public async getNotes(state: ListNoteState): Promise<ListNoteState> {
    const notes = await this.noteClient.getNotes();
    return { ...state, notes };
  }
}
