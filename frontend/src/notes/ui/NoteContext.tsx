import React, { useContext, useMemo } from 'react';
import { Note, EditNoteState, initialEditNoteState } from '../core';
import { NoteStore } from '../store';
import { useObserver } from 'mobx-react-lite';

export interface NoteContextValue {
  editNoteState: EditNoteState;
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({
  editNoteState: initialEditNoteState(),
  saveNote: async (n) => {},
});

export const NoteProvider: React.FC = (props) => {
  const noteStore = useMemo(() => new NoteStore(), []);

  return useObserver(() => {
    const { editNoteState, saveNote } = noteStore;

    return <NoteContext.Provider value={{ editNoteState, saveNote }} {...props} />;
  });
};

export const useNote = () => useContext(NoteContext);
