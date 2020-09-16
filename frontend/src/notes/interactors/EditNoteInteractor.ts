import { isEmpty } from '../../utils';
import { Note, ErrorType, NoteClient, Errors, SaveNoteResponse } from './entities';

export interface EditNoteState {
  note: Note;
  errors: Record<string, ErrorType>;
  isDirty: boolean;
}

export const newEditNoteState = (initialState: Partial<EditNoteState> = {}): EditNoteState => {
  return { note: { id: '', title: '', body: '' }, errors: {}, isDirty: false, ...initialState };
};

export class EditNoteInteractor {
  private noteClient: NoteClient;

  constructor(noteClient: NoteClient) {
    this.noteClient = noteClient;
  }

  public async getNote(state: EditNoteState, id: string): Promise<EditNoteState> {
    const note = await this.noteClient.getNote(id);
    if (!note) return { ...state, note: { id, title: '', body: '' } };
    return { ...state, note };
  }

  public setTitle(state: EditNoteState, title: string): EditNoteState {
    return { ...state, note: { ...state.note, title }, isDirty: true };
  }

  public setBody(state: EditNoteState, body: string): EditNoteState {
    return { ...state, note: { ...state.note, body }, isDirty: true };
  }

  public async saveNote(state: EditNoteState): Promise<EditNoteState> {
    const updatedState = this.validateNote(state);
    return this.maybeSaveNoteInTheClient(updatedState);
  }

  private validateNote(state: EditNoteState): EditNoteState {
    let errors: Errors = {};

    if (!state.note.title?.trim()) {
      errors = { ...errors, title: 'required' };
    }

    return { ...state, errors };
  }

  private async maybeSaveNoteInTheClient(state: EditNoteState): Promise<EditNoteState> {
    if (!isEmpty(state.errors)) return state;

    const response = await this.noteClient.saveNote(state.note);

    if (response.status === 'validation_error')
      return this.extractSaveNoteClientErrors(state, response);

    return { ...state, isDirty: false };
  }

  private extractSaveNoteClientErrors(
    state: EditNoteState,
    response: SaveNoteResponse
  ): EditNoteState {
    let errors = state.errors;

    if (response.status === 'validation_error') {
      response.errors?.forEach((error) => {
        errors = { ...errors, [error.field]: error.type as ErrorType };
      });
    }

    return { ...state, errors };
  }
}
