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
  let updatedState = { ...state, note };
  updatedState = validateNote(updatedState);
  return maybeSaveNoteInTheClient(updatedState, saveNoteClientFn);
};

const validateNote = (state: EditNoteState): EditNoteState => {
  let errors: Errors = {};

  if (!state.note.title?.trim()) {
    errors = { ...errors, title: 'required' };
  }

  return { ...state, errors };
};

const maybeSaveNoteInTheClient = async (
  state: EditNoteState,
  saveNoteClientFn: SaveNoteClientFn
): Promise<EditNoteState> => {
  if (isEmpty(state.errors)) {
    const response = await saveNoteClientFn(state.note);
    if (response.status == 'validation_error') return extractSaveNoteClientErrors(state, response);
  }
  return state;
};

const isEmpty = (record: Record<any, any>): boolean => {
  return Object.keys(record).length === 0;
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
