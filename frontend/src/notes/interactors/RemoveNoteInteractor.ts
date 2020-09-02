import { Note, NoteClient } from './entities';

export interface RemoveNoteState {
  note?: Note;
  promptConfirmation: boolean;
}

export const newRemoveNoteState = (): RemoveNoteState => {
  return { note: undefined, promptConfirmation: false };
};

export class RemoveNoteInteractor {
  constructor(private client: NoteClient) {}

  requestNoteRemoval(state: RemoveNoteState, note: Note): RemoveNoteState {
    return { ...state, note, promptConfirmation: true };
  }

  cancelNoteRemoval(state: RemoveNoteState): RemoveNoteState {
    return { ...state, note: undefined, promptConfirmation: false };
  }

  async confirmNoteRemoval(state: RemoveNoteState): Promise<RemoveNoteState> {
    if (!state.note) return state;

    await this.client.removeNote(state.note.id);

    return { ...state, note: undefined, promptConfirmation: false };
  }
}
