import { observable, action, runInAction } from 'mobx';
import { Note } from '../entities';
import {
  EditNoteState,
  newEditNoteState,
  EditNoteInteractor,
  RemoveNoteState,
  newRemoveNoteState,
  RemoveNoteInteractor,
} from '../interactors';

export class NoteStore {
  @observable editNoteState: EditNoteState = newEditNoteState();
  @observable removeNoteState: RemoveNoteState = newRemoveNoteState();

  constructor(
    private editNoteInteractor: EditNoteInteractor,
    private removeNoteInteractor: RemoveNoteInteractor
  ) {}

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

    runInAction(() => {
      this.removeNoteState = nextState;
    });
  }
}
