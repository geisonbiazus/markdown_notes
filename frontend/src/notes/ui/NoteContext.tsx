import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { EditNoteInteractor, ListNoteInteractor } from '../interactors';
import { NoteStore } from '../stores';
import { InMemoryNoteClient } from '../clients';
import { uuid } from '../../utils';

// const httpClient = new HTTPClient(appConfig.apiURL);
// const noteClient = new APINoteClient(httpClient);
const noteClient = new InMemoryNoteClient();
noteClient.saveNote({ id: uuid(), title: 'Title 1', body: 'Body 1' });
noteClient.saveNote({ id: uuid(), title: 'Title 2', body: 'Body 2' });
noteClient.saveNote({ id: uuid(), title: 'Title 3', body: 'Body 3' });

const listNoteInteractor = new ListNoteInteractor(noteClient);
const editNoteInteractor = new EditNoteInteractor(noteClient);
const noteStore = new NoteStore(listNoteInteractor, editNoteInteractor);

export interface NoteContextValue {
  listNoteState: typeof noteStore.listNoteState;
  editNoteState: typeof noteStore.editNoteState;
  getNotes: typeof noteStore.getNotes;
  saveNote: typeof noteStore.saveNote;
  getNote: typeof noteStore.getNote;
  setTitle: typeof noteStore.setTitle;
  setBody: typeof noteStore.setBody;
}

const NoteContext = React.createContext<NoteContextValue>(noteStore);

export const NoteProvider: React.FC = ({ children }) => {
  return useObserver(() => {
    const {
      listNoteState,
      editNoteState,
      getNotes,
      saveNote,
      getNote,
      setTitle,
      setBody,
    } = noteStore;

    return (
      <NoteContext.Provider
        value={{ listNoteState, editNoteState, getNotes, saveNote, getNote, setTitle, setBody }}
      >
        {children}
      </NoteContext.Provider>
    );
  });
};

export const useNoteContext = () => useContext(NoteContext);
