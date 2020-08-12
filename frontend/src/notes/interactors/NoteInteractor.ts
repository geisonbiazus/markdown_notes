import { isEmpty } from '../../utils';

export interface Note {
  id?: string;
  title?: string;
  body?: string;
}

export type ErrorType = 'required';
export type Errors = Record<string, ErrorType>;

export interface EditNoteState {
  note: Note;
  errors: Record<string, ErrorType>;
}

export const newEditNoteState = (): EditNoteState => {
  return { note: {}, errors: {} };
};

export interface ValidationError {
  field: string;
  type: string;
}

export interface SaveNoteResponse {
  status: 'success' | 'validation_error';
  note?: Note;
  errors?: ValidationError[];
}
export interface NoteClient {
  saveNote(note: Note): Promise<SaveNoteResponse>;
}

export class NoteInteractor {
  constructor(private noteClient: NoteClient) {}

  public async saveNote(state: EditNoteState, note: Note): Promise<EditNoteState> {
    let updatedState = { ...state, note };
    updatedState = this.validateNote(updatedState);
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
    if (isEmpty(state.errors)) {
      const response = await this.noteClient.saveNote(state.note);
      if (response.status === 'validation_error')
        return this.extractSaveNoteClientErrors(state, response);
    }
    return state;
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
