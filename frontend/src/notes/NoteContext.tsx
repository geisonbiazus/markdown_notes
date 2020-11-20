import React, { useContext, useMemo, useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import {
  EditNoteInteractor,
  EditNoteState,
  ListNoteInteractor,
  ListNoteState,
  newListNoteState,
  RemoveNoteInteractor,
  RemoveNoteState,
} from './interactors';
import { NoteStore } from './stores';
import { APINoteClient } from './clients';
import { AuthenticatedHTTPClient, StateManager } from '../utils';
import { Note, NoteClient } from './entities';
import { getAppConfig } from '../AppConfig';
import { useAuthenticationContext } from '../authentication';

export interface NoteContextValue {
  listNoteState: ListNoteState;
  editNoteState: EditNoteState;
  removeNoteState: RemoveNoteState;
  getNotes: () => Promise<void>;
  saveNote: () => Promise<void>;
  getNote: (id: string) => Promise<void>;
  setTitle: (title: string) => Promise<void>;
  setBody: (body: string) => Promise<void>;
  requestNoteRemoval: (note: Note) => void;
  cancelNoteRemoval: () => void;
  confirmNoteRemoval: () => Promise<void>;
}

const NoteContext = React.createContext<NoteContextValue>(null!);

function useNoteClient(): NoteClient {
  const { signInState, signInInteractor } = useAuthenticationContext();

  return useMemo(() => {
    const appConfig = getAppConfig();
    const httpClient = new AuthenticatedHTTPClient(
      appConfig.apiURL,
      signInState.token,
      signInInteractor.signOut
    );
    return new APINoteClient(httpClient);
  }, [signInState.token, signInInteractor.signOut]);
}

function useListNoteInteractor(): [ListNoteState, ListNoteInteractor] {
  const noteClient = useNoteClient();
  const [listNoteState, setListNoteState] = useState(newListNoteState());

  const listNoteInteractor = useMemo(() => {
    const stateManager = new StateManager<ListNoteState>(listNoteState, setListNoteState);
    return new ListNoteInteractor(stateManager, noteClient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteClient]);

  return [listNoteState, listNoteInteractor];
}

function useNoteStore(): NoteStore {
  const noteClient = useNoteClient();

  return useMemo(() => {
    const editNoteInteractor = new EditNoteInteractor(noteClient);
    const removeNoteInteractor = new RemoveNoteInteractor(noteClient);
    const noteStore = new NoteStore(editNoteInteractor, removeNoteInteractor);

    return noteStore;
  }, [noteClient]);
}

export const NoteProvider: React.FC = ({ children }) => {
  const noteStore = useNoteStore();
  const [listNoteState, listNoteInteractor] = useListNoteInteractor();

  return useObserver(() => {
    const {
      editNoteState,
      removeNoteState,
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
          getNotes: listNoteInteractor.getNotes,
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
