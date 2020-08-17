import { observable, action, runInAction } from 'mobx';
import { EditNoteState, newEditNoteState, NoteInteractor } from '../interactors';

export class NoteStore {
  @observable editNoteState: EditNoteState = newEditNoteState();

  constructor(private noteInteractor: NoteInteractor) {}

  @action.bound
  async getNote(id: string): Promise<void> {
    const nextState = await this.noteInteractor.getNote(this.editNoteState, id);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }

  @action.bound
  async setTitle(title: string): Promise<void> {
    this.editNoteState = this.noteInteractor.setTitle(this.editNoteState, title);
  }

  @action.bound
  async setBody(body: string): Promise<void> {
    this.editNoteState = this.noteInteractor.setBody(this.editNoteState, body);
  }

  @action.bound
  async saveNote(): Promise<void> {
    const nextState = await this.noteInteractor.saveNote(this.editNoteState);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }
}
