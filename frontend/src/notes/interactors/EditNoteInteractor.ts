import bind from 'bind-decorator';
import { ValidationErrorResponse } from '../../shared/entities';
import { isEmpty } from '../../utils/object';
import { Publisher } from '../../utils/pub_sub/Publisher';
import { StateObservableInteractor } from '../../utils/StateObservableInteractor';
import { Errors, validateRequired } from '../../utils/validations';
import { NoteClient } from '../ports/NoteClient';
import { newNote, Note } from '../entitites/Note';
import { NoteSavedPayload, NOTE_LOADED_FOR_EDITING_EVENT, NOTE_SAVED_EVENT } from '../events';

export interface EditNoteState {
  note: Note;
  errors: Errors;
  isDirty: boolean;
  getNotePending: boolean;
  saveNotePending: boolean;
}

function newEditNoteState(): EditNoteState {
  return {
    note: newNote(),
    errors: {},
    isDirty: false,
    getNotePending: false,
    saveNotePending: false,
  };
}

export class EditNoteInteractor extends StateObservableInteractor<EditNoteState> {
  constructor(private noteClient: NoteClient, private publiser: Publisher) {
    super(newEditNoteState());
  }

  @bind
  public async getNote(id: string): Promise<void> {
    this.updateState(newEditNoteState());
    await this.withPendingState('getNotePending', async () => {
      let note = await this.noteClient.getNote(id);

      if (note) {
        this.updateState({ note });
        this.publiser.publish(NOTE_LOADED_FOR_EDITING_EVENT, note);
      } else {
        this.updateState({ note: newNote({ id }) });
      }
    });
  }

  @bind
  public setTitle(title: string): void {
    const note = this.state.note;
    this.updateState({ note: { ...note, title }, isDirty: true });
  }

  @bind
  public setBody(body: string): void {
    const note = this.state.note;
    this.updateState({ note: { ...note, body }, isDirty: true });
  }

  @bind
  public async saveNote(): Promise<boolean> {
    return await this.withPendingState('saveNotePending', async () => {
      if (!this.validateNote()) return false;
      await this.maybeSaveNoteInTheClient();
      this.publiser.publish<NoteSavedPayload>(NOTE_SAVED_EVENT, this.state.note);
      return true;
    });
  }

  private validateNote(): boolean {
    let errors: Errors = {};
    errors = validateRequired(errors, this.state.note, 'title');

    this.updateState({ errors });

    return isEmpty(errors);
  }

  private async maybeSaveNoteInTheClient(): Promise<void> {
    const response = await this.noteClient.saveNote(this.state.note);

    if (response.status === 'validation_error') {
      this.extractSaveNoteClientErrors(response);
      return;
    }

    this.updateState({ isDirty: false });
  }

  private extractSaveNoteClientErrors(response: ValidationErrorResponse): void {
    let errors: Errors = {};

    response.errors?.forEach((error) => {
      errors = { ...errors, [error.field]: error.type };
    });

    this.updateState({ errors });
  }
}
