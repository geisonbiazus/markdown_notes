import { observable, action, runInAction } from 'mobx';
import { EditNoteState, initialEditNoteState, Note, saveNote } from './core';
import { InMemoryNoteClient } from './clients';

export class NoteStore {
  @observable editNoteState: EditNoteState = initialEditNoteState();

  constructor(private noteClient: InMemoryNoteClient) {}

  @action.bound
  async saveNote(note: Note): Promise<void> {
    console.log(this.noteClient);

    const nextState = await saveNote(this.editNoteState, note, this.noteClient.saveNote);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }
}
