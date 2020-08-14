import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { NoteInteractor } from '../interactors';
import { InMemoryNoteClient } from '../clients';
import { NoteStore } from '../stores';

// const appConfig = getAppConfig();
// const httpClient = new HTTPClient(appConfig.apiURL);
// const noteClient = new APINoteClient(httpClient);
const noteClient = new InMemoryNoteClient();
const noteInteractor = new NoteInteractor(noteClient);
const noteStore = new NoteStore(noteInteractor);

export interface NoteContextValue {
  editNoteState: typeof noteStore.editNoteState;
  saveNote: typeof noteStore.saveNote;
  getNote: typeof noteStore.getNote;
}

const NoteContext = React.createContext<NoteContextValue>(noteStore);

export const NoteProvider: React.FC = ({ children }) => {
  return useObserver(() => {
    const { editNoteState, saveNote, getNote } = noteStore;

    return (
      <NoteContext.Provider value={{ editNoteState, saveNote, getNote }}>
        {children}
      </NoteContext.Provider>
    );
  });
};

export const useNote = () => useContext(NoteContext);
