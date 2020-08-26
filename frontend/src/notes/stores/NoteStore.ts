import { observable, action, runInAction } from 'mobx';
import { EditNoteState, newEditNoteState, EditNoteInteractor } from '../interactors';

export class NoteStore {
  @observable editNoteState: EditNoteState = newEditNoteState();

  constructor(private editNoteInteractor: EditNoteInteractor) {}

  @action.bound
  async getNote(id: string): Promise<void> {
    this.editNoteState = newEditNoteState();

    const nextState = await this.editNoteInteractor.getNote(this.editNoteState, id);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }

  @action.bound
  async setTitle(title: string): Promise<void> {
    this.editNoteState = this.editNoteInteractor.setTitle(this.editNoteState, title);
  }

  @action.bound
  async setBody(body: string): Promise<void> {
    this.editNoteState = this.editNoteInteractor.setBody(this.editNoteState, body);
  }

  @action.bound
  async saveNote(): Promise<void> {
    const nextState = await this.editNoteInteractor.saveNote(this.editNoteState);

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }
}
