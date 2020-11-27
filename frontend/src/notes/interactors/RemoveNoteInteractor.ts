import bind from 'bind-decorator';
import { Publisher, StateBasedInteractor, StateManager } from '../../utils';
import { Note, NoteClient } from '../entities';

export interface RemoveNoteState {
  note?: Note;
  promptConfirmation: boolean;
  confirmNoteRemovalPending: boolean;
}

export const newRemoveNoteState = (): RemoveNoteState => {
  return { note: undefined, promptConfirmation: false, confirmNoteRemovalPending: false };
};

export class RemoveNoteInteractor extends StateBasedInteractor<RemoveNoteState> {
  constructor(
    stateManager: StateManager<RemoveNoteState>,
    private client: NoteClient,
    private publisher: Publisher
  ) {
    super(stateManager);
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
