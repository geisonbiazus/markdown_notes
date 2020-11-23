import bind from 'bind-decorator';
import { StateBasedInteractor, StateManager } from '../../utils';
import { Note, NoteClient } from '../entities';

export interface ListNoteState {
  notes: Note[];
}

export function newListNoteState(): ListNoteState {
  return { notes: [] };
}

export class ListNoteInteractor extends StateBasedInteractor<ListNoteState> {
  constructor(stateManager: StateManager<ListNoteState>, private noteClient: NoteClient) {
    super(stateManager);
  }

  @bind
  public async getNotes(): Promise<void> {
    const notes = await this.noteClient.getNotes();
    this.updateState({ notes });
  }
}
