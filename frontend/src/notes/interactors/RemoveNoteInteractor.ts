import bind from 'bind-decorator';
import { StateBasedInteractor, StateManager } from '../../utils';
import { Note, NoteClient } from '../entities';

export interface RemoveNoteState {
  note?: Note;
  promptConfirmation: boolean;
}

export const newRemoveNoteState = (): RemoveNoteState => {
  return { note: undefined, promptConfirmation: false };
};

export class RemoveNoteInteractor extends StateBasedInteractor<RemoveNoteState> {
  constructor(stateManager: StateManager<RemoveNoteState>, private client: NoteClient) {
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
    if (!this.state.note) return;

    await this.client.removeNote(this.state.note.id);

    this.updateState({ note: undefined, promptConfirmation: false });
  }
}
