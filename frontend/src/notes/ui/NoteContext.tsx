import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { EditNoteInteractor } from '../interactors';
import { NoteStore } from '../stores';
import { InMemoryNoteClient } from '../clients';

// const httpClient = new HTTPClient(appConfig.apiURL);
// const noteClient = new APINoteClient(httpClient);
const noteClient = new InMemoryNoteClient();
const editNoteInteractor = new EditNoteInteractor(noteClient);
const noteStore = new NoteStore(editNoteInteractor);

export interface NoteContextValue {
  editNoteState: typeof noteStore.editNoteState;
  saveNote: typeof noteStore.saveNote;
  getNote: typeof noteStore.getNote;
  setTitle: typeof noteStore.setTitle;
  setBody: typeof noteStore.setBody;
}

const NoteContext = React.createContext<NoteContextValue>(noteStore);

export const NoteProvider: React.FC = ({ children }) => {
  return useObserver(() => {
    const { editNoteState, saveNote, getNote, setTitle, setBody } = noteStore;

    return (
      <NoteContext.Provider value={{ editNoteState, saveNote, getNote, setTitle, setBody }}>
        {children}
      </NoteContext.Provider>
    );
  });
};

export const useNoteContext = () => useContext(NoteContext);
