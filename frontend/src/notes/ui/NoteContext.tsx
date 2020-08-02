import React, { useContext, useState, useCallback } from 'react';
import { Note, EditNoteState, initialEditNoteState, saveNote } from '../core';

export interface NoteContextValue {
  editNoteState: EditNoteState;
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({
  editNoteState: initialEditNoteState(),
  saveNote: async (n) => {},
});

export const NoteProvider: React.FC = (props) => {
  const [editNoteState, setEditNoteState] = useState(initialEditNoteState());

  const saveNoteCb = useCallback(
    async (note: Note) => setEditNoteState(await saveNote(editNoteState, note)),
    [setEditNoteState]
  );

  return <NoteContext.Provider value={{ editNoteState, saveNote: saveNoteCb }} {...props} />;
};

export const useNote = () => useContext(NoteContext);
