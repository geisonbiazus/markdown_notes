import { Note } from './entities';

export interface RemoveNoteState {
  note?: Note;
  promptConfirmation: boolean;
}

export const newRemoveNoteState = (): RemoveNoteState => {
  return { note: undefined, promptConfirmation: false };
};

export class RemoveNoteInteractor {
  requestNoteRemoval(state: RemoveNoteState, note: Note): RemoveNoteState {
    return { ...state, note, promptConfirmation: true };
  }
}
