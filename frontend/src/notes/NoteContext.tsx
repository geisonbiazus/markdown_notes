import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../app';
import { getAppConfig } from '../AppConfig';
import { useAuthenticationContext } from '../authentication';
import { AuthenticatedHTTPClient, StateManager } from '../utils';
import { APINoteClient } from './clients';
import { NoteClient } from './entities';
import {
  EditNoteInteractor,
  EditNoteState,
  ListNoteInteractor,
  ListNoteState,
  newEditNoteState,
  newListNoteState,
  newRemoveNoteState,
  RemoveNoteInteractor,
  RemoveNoteState,
} from './interactors';

export interface NoteContextValue {
  listNoteState: ListNoteState;
  listNoteInteractor: ListNoteInteractor;
  editNoteState: EditNoteState;
  editNoteInteractor: EditNoteInteractor;
  removeNoteState: RemoveNoteState;
  removeNoteInteractor: RemoveNoteInteractor;
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

function useListNoteInteractor(noteClient: NoteClient): [ListNoteState, ListNoteInteractor] {
  const { pubSub } = useAppContext();
  const [listNoteState, setListNoteState] = useState(newListNoteState());

  const listNoteInteractor = useMemo(() => {
    const stateManager = new StateManager<ListNoteState>(listNoteState, setListNoteState);
    return new ListNoteInteractor(stateManager, noteClient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteClient]);

  useEffect(() => {
    const disposeNoteSaved = pubSub.subscribe('note_saved', () => listNoteInteractor.getNotes());
    const disposeNoteRemoved = pubSub.subscribe('note_removed', () =>
      listNoteInteractor.getNotes()
    );

    return () => {
      disposeNoteSaved();
      disposeNoteRemoved();
    };
  }, [listNoteInteractor, pubSub]);

  return [listNoteState, listNoteInteractor];
}

function useRemoveNoteInteractor(noteClient: NoteClient): [RemoveNoteState, RemoveNoteInteractor] {
  const { pubSub } = useAppContext();
  const [removeNoteState, setRemoveNoteState] = useState(newRemoveNoteState());

  const removeNoteInteractor = useMemo(() => {
    const stateManager = new StateManager<RemoveNoteState>(removeNoteState, setRemoveNoteState);
    return new RemoveNoteInteractor(stateManager, noteClient, pubSub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteClient]);

  return [removeNoteState, removeNoteInteractor];
}

function useEditNoteInteractor(noteClient: NoteClient): [EditNoteState, EditNoteInteractor] {
  const { pubSub } = useAppContext();
  const [editNoteState, setEditNoteState] = useState(newEditNoteState());

  const editNoteInteractor = useMemo(() => {
    const stateManager = new StateManager<EditNoteState>(editNoteState, setEditNoteState);
    return new EditNoteInteractor(stateManager, noteClient, pubSub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteClient]);

  return [editNoteState, editNoteInteractor];
}

export const NoteProvider: React.FC = ({ children }) => {
  const noteClient = useNoteClient();
  const [listNoteState, listNoteInteractor] = useListNoteInteractor(noteClient);
  const [removeNoteState, removeNoteInteractor] = useRemoveNoteInteractor(noteClient);
  const [editNoteState, editNoteInteractor] = useEditNoteInteractor(noteClient);

  return (
    <NoteContext.Provider
      value={{
        listNoteState,
        listNoteInteractor,
        editNoteState,
        editNoteInteractor,
        removeNoteState,
        removeNoteInteractor,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => useContext(NoteContext);
