import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { EditNoteInteractor, ListNoteInteractor, RemoveNoteInteractor } from '../interactors';
import { NoteStore } from '../stores';
import { APINoteClient } from '../clients';
import { HTTPClient } from '../../utils';
import { getAppConfig } from '../../AppConfig';

const appConfig = getAppConfig();
const httpClient = new HTTPClient(appConfig.apiURL);
const noteClient = new APINoteClient(httpClient);
// const noteClient = new InMemoryNoteClient();
// noteClient.saveNote({ id: uuid(), title: 'Title 1', body: 'Body 1' });
// noteClient.saveNote({ id: uuid(), title: 'Title 2', body: 'Body 2' });
// noteClient.saveNote({ id: uuid(), title: 'Title 3', body: 'Body 3' });

const listNoteInteractor = new ListNoteInteractor(noteClient);
const editNoteInteractor = new EditNoteInteractor(noteClient);
const removeNoteInteractor = new RemoveNoteInteractor(noteClient);
const noteStore = new NoteStore(listNoteInteractor, editNoteInteractor, removeNoteInteractor);

export interface NoteContextValue {
  listNoteState: typeof noteStore.listNoteState;
  editNoteState: typeof noteStore.editNoteState;
  removeNoteState: typeof noteStore.removeNoteState;
  getNotes: typeof noteStore.getNotes;
  saveNote: typeof noteStore.saveNote;
  getNote: typeof noteStore.getNote;
  setTitle: typeof noteStore.setTitle;
  setBody: typeof noteStore.setBody;
  requestNoteRemoval: typeof noteStore.requestNoteRemoval;
  cancelNoteRemoval: typeof noteStore.cancelNoteRemoval;
  confirmNoteRemoval: typeof noteStore.confirmNoteRemoval;
}

const NoteContext = React.createContext<NoteContextValue>(noteStore);

export const NoteProvider: React.FC = ({ children }) => {
  return useObserver(() => {
    const {
      listNoteState,
      editNoteState,
      removeNoteState,
      getNotes,
      saveNote,
      getNote,
      setTitle,
      setBody,
      requestNoteRemoval,
      cancelNoteRemoval,
      confirmNoteRemoval,
    } = noteStore;

    return (
      <NoteContext.Provider
        value={{
          listNoteState,
          editNoteState,
          removeNoteState,
          getNotes,
          saveNote,
          getNote,
          setTitle,
          setBody,
          requestNoteRemoval,
          cancelNoteRemoval,
          confirmNoteRemoval,
        }}
      >
        {children}
      </NoteContext.Provider>
    );
  });
};

export const useNoteContext = () => useContext(NoteContext);
