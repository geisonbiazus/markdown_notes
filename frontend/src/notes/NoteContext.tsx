import React, { useContext } from 'react';

export interface Note {
  id: string;
  title: string;
  body: string;
}

const saveNote = async (note: Note): Promise<void> => {
  console.log(note);
};

export interface NoteContextValue {
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({ saveNote });

export const NoteProvider: React.FC = (props) => {
  return <NoteContext.Provider value={{ saveNote }} {...props} />;
};

export const useNote = () => useContext(NoteContext);
