import bind from 'bind-decorator';
import { StateObservableStore } from '../../shared/stores/StateObservableStore';
import { NoteClient } from '../ports/NoteClient';
import { Note } from '../entitites/Note';

export interface ListNoteState {
  notes: Note[];
  getNotesPending: boolean;
  activeNoteId?: string;
}

export class ListNoteStore extends StateObservableStore<ListNoteState> {
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
