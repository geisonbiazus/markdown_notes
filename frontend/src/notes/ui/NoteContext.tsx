import React, { useContext } from 'react';
import { Note, init } from '../core';

export interface NoteContextValue {
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({ saveNote: async (n) => {} });

export const NoteProvider: React.FC = (props) => {
  const { saveNote } = init();

  return <NoteContext.Provider value={{ saveNote }} {...props} />;
};

export const useNote = () => useContext(NoteContext);
