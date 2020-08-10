import { observable, action, runInAction } from 'mobx';
import { EditNoteState, newEditNoteState, Note, NoteInteractor } from '../interactors';

export class NoteStore {
  @observable editNoteState: EditNoteState = newEditNoteState();

  constructor(private noteInteractor: NoteInteractor) {}

  @action.bound
  async saveNote(note: Note): Promise<void> {
    const nextState = await this.noteInteractor.saveNote(this.editNoteState, note);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }
}
