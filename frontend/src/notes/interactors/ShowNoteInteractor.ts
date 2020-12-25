import bind from 'bind-decorator';
import { StateObservableInteractor } from '../../utils';
import { Note, NoteClient } from '../entities';

export interface ShowNoteState {
  note?: Note;
  getNotePending: boolean;
  isFound: boolean;
}

function newShowNoteState(): ShowNoteState {
  return {
    getNotePending: false,
    isFound: true,
  };
}

export class ShowNoteInteractor extends StateObservableInteractor<ShowNoteState> {
  constructor(private noteClient: NoteClient) {
    super(newShowNoteState());
  }

  @bind
  public async getNote(id: string): Promise<void> {
    this.withPendingState('getNotePending', async () => {
      const note = await this.noteClient.getNote(id);
      if (note) {
        this.updateState({ note, isFound: true });
      } else {
        this.updateState({ isFound: false });
      }
    });
  }
}
