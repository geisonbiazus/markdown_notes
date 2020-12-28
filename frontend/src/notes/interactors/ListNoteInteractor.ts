import bind from 'bind-decorator';
import { StateObservableInteractor } from '../../utils';
import { Note, NoteClient } from '../entities';

export interface ListNoteState {
  notes: Note[];
  getNotesPending: boolean;
  activeNoteId?: string;
}

export class ListNoteInteractor extends StateObservableInteractor<ListNoteState> {
  constructor(private noteClient: NoteClient) {
    super({ notes: [], getNotesPending: false });
  }

  @bind
  public async getNotes(): Promise<void> {
    await this.withPendingState('getNotesPending', async () => {
      const notes = await this.noteClient.getNotes();
      this.updateState({ notes });
    });
  }

  @bind
  public setActiveNoteId(noteId: string): void {
    this.updateState({ activeNoteId: noteId });
  }
}
