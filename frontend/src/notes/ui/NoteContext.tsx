import React, { useContext } from 'react';
import { saveNote, Note } from '../core';

export interface NoteContextValue {
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({ saveNote });

export const NoteProvider: React.FC = (props) => {
  return <NoteContext.Provider value={{ saveNote }} {...props} />;
};

export const useNote = () => useContext(NoteContext);
