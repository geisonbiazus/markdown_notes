import { observable, action, runInAction } from 'mobx';
import { Note } from '../entities';
import {
  EditNoteState,
  newEditNoteState,
  EditNoteInteractor,
  ListNoteState,
  newListNoteState,
  ListNoteInteractor,
  RemoveNoteState,
  newRemoveNoteState,
  RemoveNoteInteractor,
} from '../interactors';

export class NoteStore {
  @observable listNoteState: ListNoteState = newListNoteState();
  @observable editNoteState: EditNoteState = newEditNoteState();
  @observable removeNoteState: RemoveNoteState = newRemoveNoteState();

  constructor(
    private listNoteInteractor: ListNoteInteractor,
    private editNoteInteractor: EditNoteInteractor,
    private removeNoteInteractor: RemoveNoteInteractor
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
    await this.getNotes();

    runInAction(() => {
      this.editNoteState = nextState;
    });
  }

  @action.bound
  requestNoteRemoval(note: Note): void {
    this.removeNoteState = this.removeNoteInteractor.requestNoteRemoval(this.removeNoteState, note);
  }

  @action.bound
  cancelNoteRemoval(): void {
    this.removeNoteState = this.removeNoteInteractor.cancelNoteRemoval(this.removeNoteState);
  }

  @action.bound
  async confirmNoteRemoval(): Promise<void> {
    const nextState = await this.removeNoteInteractor.confirmNoteRemoval(this.removeNoteState);
    await this.getNotes();

    runInAction(() => {
      this.removeNoteState = nextState;
    });
  }
}
