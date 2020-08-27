import { observable, action, runInAction } from 'mobx';
import {
  EditNoteState,
  newEditNoteState,
  EditNoteInteractor,
  ListNoteState,
  newListNoteState,
  ListNoteInteractor,
} from '../interactors';

export class NoteStore {
  @observable listNoteState: ListNoteState = newListNoteState();
  @observable editNoteState: EditNoteState = newEditNoteState();

  constructor(
    private listNoteInteractor: ListNoteInteractor,
    private editNoteInteractor: EditNoteInteractor
  ) {}

  @action.bound
  async getNotes(): Promise<void> {
    const nextState = await this.listNoteInteractor.getNotes(this.listNoteState);

    runInAction(() => {
      this.listNoteState = nextState;
    });
  }

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
