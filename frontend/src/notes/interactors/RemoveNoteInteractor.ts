import bind from 'bind-decorator';
import { Publisher, StateObservableInteractor } from '../../utils';
import { Note, NoteClient } from '../entities';

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

      this.publisher.pusblish('note_removed', this.state.note);

      this.updateState({ note: undefined, promptConfirmation: false });
    });
  }
}
