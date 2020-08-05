import React, { useContext, useMemo } from 'react';
import { Note, EditNoteState, initialEditNoteState, NoteInteractor } from '../interactors';
import { NoteStore } from '../stores';
import { useObserver } from 'mobx-react-lite';
import { InMemoryNoteClient } from '../clients';

export interface NoteContextValue {
  editNoteState: EditNoteState;
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({
  editNoteState: initialEditNoteState(),
  saveNote: async (n) => {},
});

export const NoteProvider: React.FC = (props) => {
  const noteStore = useMemo(() => new NoteStore(new NoteInteractor(new InMemoryNoteClient())), []);

  return useObserver(() => {
    const { editNoteState, saveNote } = noteStore;

    return <NoteContext.Provider value={{ editNoteState, saveNote }} {...props} />;
  });
};

export const useNote = () => useContext(NoteContext);
