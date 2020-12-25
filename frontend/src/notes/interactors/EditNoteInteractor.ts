import bind from 'bind-decorator';
import {
  Errors,
  ErrorType,
  isEmpty,
  Publisher,
  StateObservableInteractor,
  validateRequired,
} from '../../utils';
import { newNote, Note, NoteClient, ValidationErrorResponse } from '../entities';
import { NoteSavedPayload, NOTE_SAVED_EVENT } from '../events';

export interface EditNoteState {
  note: Note;
  errors: Record<string, ErrorType>;
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
      this.updateState({ note: note || newNote({ id }) });
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
  public async saveNote(): Promise<void> {
    await this.withPendingState('saveNotePending', async () => {
      if (!this.validateNote()) return;
      await this.maybeSaveNoteInTheClient();
      this.publiser.pusblish<NoteSavedPayload>(NOTE_SAVED_EVENT, this.state.note);
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
      errors = { ...errors, [error.field]: error.type as ErrorType };
    });

    this.updateState({ errors });
  }
}
