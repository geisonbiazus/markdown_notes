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

export interface SaveNoteResponse {
  status: 'success' | 'validation_error';
  note?: Note;
  errors?: ValidationError[];
}
export type SaveNoteClientFn = (note: Note) => Promise<SaveNoteResponse>;

export const saveNote = async (
  state: EditNoteState,
  note: Note,
  saveNoteClientFn: SaveNoteClientFn
): Promise<EditNoteState> => {
  let errors: Errors = {};

  if (!note.title?.trim()) {
    errors = { ...errors, title: 'required' };
  }

  const response = await saveNoteClientFn?.(note);

  if (response && response.status === 'validation_error') {
    response.errors?.forEach((error) => {
      errors = { ...errors, [error.field]: error.type as ErrorType };
    });
  }

  return { ...state, note, errors };
};
