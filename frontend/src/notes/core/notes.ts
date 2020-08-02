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
  const subscribers: ((state: EditNoteState) => void)[] = [];

  const getState = (): EditNoteState => {
    return state;
  };

  const updateState = (newState: Partial<EditNoteState>): void => {
    state = { ...state, ...newState };
    notify();
  };

  const saveNote = async (note: Note): Promise<void> => {
    updateState({ errors: { title: 'required' } });
  };

  const notify = () => {
    subscribers.forEach((cb) => cb(state));
  };

  const subscribe = (cb: (state: EditNoteState) => void): void => {
    subscribers.push(cb);
  };

  return { getState, saveNote, subscribe };
};

export const initialEditNoteState = (): EditNoteState => {
  return { note: {}, errors: {} };
};

export const saveNote = async (state: EditNoteState, note: Note): Promise<EditNoteState> => {
  return { ...state, errors: { title: 'required' } };
};
