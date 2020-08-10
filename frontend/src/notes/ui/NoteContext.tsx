import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { NoteInteractor } from '../interactors';
import { HTTPClient } from '../../utils';
import { APINoteClient } from '../clients';
import { NoteStore } from '../stores';
import { getAppConfig } from '../../AppConfig';

const appConfig = getAppConfig();
const httpClient = new HTTPClient(appConfig.apiURL);
const noteClient = new APINoteClient(httpClient);
const noteInteractor = new NoteInteractor(noteClient);
const noteStore = new NoteStore(noteInteractor);

export interface NoteContextValue {
  editNoteState: typeof noteStore.editNoteState;
  saveNote: typeof noteStore.saveNote;
}

const NoteContext = React.createContext<NoteContextValue>(noteStore);

export const NoteProvider: React.FC = ({ children }) => {
  return useObserver(() => {
    const { editNoteState, saveNote } = noteStore;

    return (
      <NoteContext.Provider value={{ editNoteState, saveNote }}>{children}</NoteContext.Provider>
    );
  });
};

export const useNote = () => useContext(NoteContext);
