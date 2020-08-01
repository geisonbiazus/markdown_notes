export interface Note {
  id?: string;
  title?: string;
  body?: string;
}

export type ErrorType = 'required';

export interface EditNoteState {
  note: Note;
  errors: Record<string, ErrorType>;
}

export const init = () => {
  let state: EditNoteState = { note: {}, errors: {} };

  const getState = (): EditNoteState => {
    return state;
  };

  const updateState = (newState: Partial<EditNoteState>): void => {
    state = { ...state, ...newState };
  };

  const saveNote = async (note: Note): Promise<void> => {
    updateState({ errors: { id: 'required' } });
  };

  return { getState, saveNote };
};
