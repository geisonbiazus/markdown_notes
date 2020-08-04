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

export const initialEditNoteState = (): EditNoteState => {
  return { note: {}, errors: {} };
};

export interface ValidationError {
  field: string;
  type: string;
}

export interface SaveNoteClientFnResponse {
  status: 'success' | 'validation_error';
  note?: Note;
  errors?: ValidationError[];
}
export type SaveNoteClientFn = (note: Note) => Promise<SaveNoteClientFnResponse>;

export const saveNote = async (
  state: EditNoteState,
  note: Note,
  saveNoteClientFn: SaveNoteClientFn
): Promise<EditNoteState> => {
  let updatedState = state;
  updatedState = validateNote(state, note);

  if (Object.keys(updatedState.errors).length === 0) {
    const response = await saveNoteClientFn(note);
    if (response.status == 'validation_error') {
      updatedState = extractSaveNoteClientErrors(updatedState, response);
    }
  }

  return { ...updatedState, note };
};

const validateNote = (state: EditNoteState, note: Note): EditNoteState => {
  let errors: Errors = {};

  if (!note.title?.trim()) {
    errors = { ...errors, title: 'required' };
  }

  return { ...state, errors };
};

const extractSaveNoteClientErrors = (
  state: EditNoteState,
  response: SaveNoteClientFnResponse
): EditNoteState => {
  let errors = state.errors;

  if (response.status === 'validation_error') {
    response.errors?.forEach((error) => {
      errors = { ...errors, [error.field]: error.type as ErrorType };
    });
  }

  return { ...state, errors };
};
