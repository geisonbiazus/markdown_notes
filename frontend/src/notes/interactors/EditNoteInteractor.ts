import bind from 'bind-decorator';
import {
  Errors,
  ErrorType,
  isEmpty,
  Publisher,
  StateBasedInteractor,
  StateManager,
  validateRequired,
} from '../../utils';
import { Note, NoteClient, SaveNoteResponse } from '../entities';

export interface EditNoteState {
  note: Note;
  errors: Record<string, ErrorType>;
  isDirty: boolean;
  getNotePending: boolean;
  saveNotePending: boolean;
}

export const newEditNoteState = (initialState: Partial<EditNoteState> = {}): EditNoteState => {
  return {
    note: { id: '', title: '', body: '' },
    errors: {},
    isDirty: false,
    getNotePending: false,
    saveNotePending: false,
    ...initialState,
  };
};

export class EditNoteInteractor extends StateBasedInteractor<EditNoteState> {
  constructor(
    stateManager: StateManager<EditNoteState>,
    private noteClient: NoteClient,
    private publiser: Publisher
  ) {
    super(stateManager);
  }

  @bind
  public async getNote(id: string): Promise<void> {
    await this.withPendingState('getNotePending', async () => {
      let note = await this.noteClient.getNote(id);
      this.updateState({ note: note || this.newNote(id) });
    });
  }

  private newNote(id: string): Note {
    return { id, title: '', body: '' };
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
      this.publiser.pusblish('note_saved', this.state.note);
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

  private extractSaveNoteClientErrors(response: SaveNoteResponse): void {
    let errors: Errors = {};

    response.errors?.forEach((error) => {
      errors = { ...errors, [error.field]: error.type as ErrorType };
    });

    this.updateState({ errors });
  }
}
