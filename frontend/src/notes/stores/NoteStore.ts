import { observable, action, runInAction } from 'mobx';
import { EditNoteState, initialEditNoteState, Note, NoteInteractor } from '../interactors';

export class NoteStore {
  @observable editNoteState: EditNoteState = initialEditNoteState();

  constructor(private noteInteractor: NoteInteractor) {}

  @action.bound
  async saveNote(note: Note): Promise<void> {
    const nextState = await this.noteInteractor.saveNote(this.editNoteState, note);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }
}
