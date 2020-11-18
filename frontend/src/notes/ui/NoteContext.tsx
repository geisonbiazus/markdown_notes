import React, { useContext, useMemo } from 'react';
import { useObserver } from 'mobx-react-lite';
import {
  EditNoteInteractor,
  EditNoteState,
  ListNoteInteractor,
  ListNoteState,
  RemoveNoteInteractor,
  RemoveNoteState,
} from '../interactors';
import { NoteStore } from '../stores';
import { APINoteClient } from '../clients';
import { AuthenticatedHTTPClient } from '../../utils';
import { Note } from '..';
import { getAppConfig } from '../../AppConfig';
import { useAuthenticationContext } from '../../authentication';

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

function useNoteStore(): NoteStore {
  const { signInState, signInInteractor } = useAuthenticationContext();

  return useMemo(() => {
    const appConfig = getAppConfig();
    const httpClient = new AuthenticatedHTTPClient(
      appConfig.apiURL,
      signInState.token,
      signInInteractor.signOut
    );
    const noteClient = new APINoteClient(httpClient);

    const listNoteInteractor = new ListNoteInteractor(noteClient);
    const editNoteInteractor = new EditNoteInteractor(noteClient);
    const removeNoteInteractor = new RemoveNoteInteractor(noteClient);
    const noteStore = new NoteStore(listNoteInteractor, editNoteInteractor, removeNoteInteractor);

    return noteStore;
  }, [signInState.token, signInInteractor.signOut]);
}

export const NoteProvider: React.FC = ({ children }) => {
  const noteStore = useNoteStore();

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
