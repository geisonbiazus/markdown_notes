import bind from 'bind-decorator';
import { Publisher } from '../../utils/pub_sub/Publisher';
import { StateObservableInteractor } from '../../utils/StateObservableInteractor';
import { NoteClient } from '../ports/NoteClient';
import { Note } from '../entitites/Note';
import { NOTE_LOADED_FOR_SHOWING_EVENT } from '../events';

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
  constructor(private noteClient: NoteClient, private publisher: Publisher) {
    super(newShowNoteState());
  }

  @bind
  public async getNote(id: string): Promise<void> {
    this.withPendingState('getNotePending', async () => {
      const note = await this.noteClient.getNote(id);
      if (note) {
        this.updateState({ note, isFound: true });
        this.publisher.publish(NOTE_LOADED_FOR_SHOWING_EVENT, note);
      } else {
        this.updateState({ note: undefined, isFound: false });
      }
    });
  }
}
