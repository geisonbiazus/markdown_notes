import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Note, EditNoteState, newEditNoteState, NoteInteractor } from '../interactors';
import { HTTPClient } from '../../utils';
import { APINoteClient } from '../clients';
import { NoteStore } from '../stores';

export interface NoteContextValue {
  editNoteState: EditNoteState;
  saveNote: (note: Note) => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>({
  editNoteState: newEditNoteState(),
  saveNote: async (n) => {},
});

const httpClient = new HTTPClient('http://localhost:4000');
const noteClient = new APINoteClient(httpClient);
const noteInteractor = new NoteInteractor(noteClient);
const noteStore = new NoteStore(noteInteractor);

export const NoteProvider: React.FC = ({ children }) => {
  return useObserver(() => {
    const { editNoteState, saveNote } = noteStore;

    return (
      <NoteContext.Provider value={{ editNoteState, saveNote }}>{children}</NoteContext.Provider>
    );
  });
};

export const useNote = () => useContext(NoteContext);
