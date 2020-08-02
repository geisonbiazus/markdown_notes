import React, { useContext, useMemo, useState, useEffect } from 'react';
import { Note, init, EditNoteState } from '../core';

export interface NoteContextValue {
  editNoteState: EditNoteState;
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({
  editNoteState: { note: {}, errors: {} },
  saveNote: async (n) => {},
});

export const NoteProvider: React.FC = (props) => {
  const { saveNote, getState, subscribe } = useMemo(() => init(), [init]);
  const [editNoteState, setEditNoteState] = useState<EditNoteState>(getState());

  useEffect(() => {
    subscribe(setEditNoteState);
  }, [subscribe]);

  return <NoteContext.Provider value={{ editNoteState, saveNote }} {...props} />;
};

export const useNote = () => useContext(NoteContext);
