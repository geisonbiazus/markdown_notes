import { observable, action, runInAction } from 'mobx';
import { EditNoteState, initialEditNoteState, Note, saveNote } from './core';

export class NoteStore {
  @observable editNoteState: EditNoteState = initialEditNoteState();

  @action.bound
  async saveNote(note: Note): Promise<void> {
    const nextState = await saveNote(this.editNoteState, note);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }
}
