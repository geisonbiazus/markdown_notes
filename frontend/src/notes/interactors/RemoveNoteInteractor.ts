import bind from 'bind-decorator';
import { Publisher } from '../../utils/pub_sub/Publisher';
import { StateObservableInteractor } from '../../utils/StateObservableInteractor';
import { Note, NoteClient } from '../entities';
import { NoteRemovedPayload, NOTE_REMOVED_EVENT } from '../events';

export interface RemoveNoteState {
  note?: Note;
  promptConfirmation: boolean;
  confirmNoteRemovalPending: boolean;
}

export class RemoveNoteInteractor extends StateObservableInteractor<RemoveNoteState> {
  constructor(private client: NoteClient, private publisher: Publisher) {
    super({ note: undefined, promptConfirmation: false, confirmNoteRemovalPending: false });
  }

  @bind
  public requestNoteRemoval(note: Note): void {
    this.updateState({ note, promptConfirmation: true });
  }

  @bind
  public cancelNoteRemoval(): void {
    this.updateState({ note: undefined, promptConfirmation: false });
  }

  @bind
  public async confirmNoteRemoval(): Promise<void> {
    await this.withPendingState('confirmNoteRemovalPending', async () => {
      if (!this.state.note) return;

      await this.client.removeNote(this.state.note.id);

      this.publisher.publish<NoteRemovedPayload>(NOTE_REMOVED_EVENT, this.state.note);

      this.updateState({ note: undefined, promptConfirmation: false });
    });
  }
}
