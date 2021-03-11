import React, { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../app/AppReactContext';
import { EditNoteInteractor, EditNoteState } from './interactors/EditNoteInteractor';
import { ListNoteInteractor, ListNoteState } from './interactors/ListNoteInteractor';
import { RemoveNoteInteractor, RemoveNoteState } from './interactors/RemoveNoteInteractor';
import { ShowNoteInteractor, ShowNoteState } from './interactors/ShowNoteInteractor';

export interface NoteContextValue {
  listNoteState: ListNoteState;
  listNoteInteractor: ListNoteInteractor;
  showNoteState: ShowNoteState;
  showNoteInteractor: ShowNoteInteractor;
  editNoteState: EditNoteState;
  editNoteInteractor: EditNoteInteractor;
  removeNoteState: RemoveNoteState;
  removeNoteInteractor: RemoveNoteInteractor;
}

const NoteReactContext = React.createContext<NoteContextValue>(null!);

function useListNoteInteractor(): [ListNoteState, ListNoteInteractor] {
  const { pubSub, noteContext } = useAppContext();
  const { listNoteInteractor } = noteContext;
  const [listNoteState, setListNoteState] = useState(listNoteInteractor.state);

  useEffect(() => {
    const dispose = listNoteInteractor.observe(setListNoteState);
    return dispose;
  }, [listNoteInteractor, pubSub]);

  return [listNoteState, listNoteInteractor];
}

function useRemoveNoteInteractor(): [RemoveNoteState, RemoveNoteInteractor] {
  const { noteContext } = useAppContext();
  const { removeNoteInteractor } = noteContext;
  const [removeNoteState, setRemoveNoteState] = useState(removeNoteInteractor.state);

  useEffect(() => {
    const dispose = removeNoteInteractor.observe(setRemoveNoteState);
    return dispose;
  }, [removeNoteInteractor]);

  return [removeNoteState, removeNoteInteractor];
}

function useEditNoteInteractor(): [EditNoteState, EditNoteInteractor] {
  const { noteContext } = useAppContext();
  const { editNoteInteractor } = noteContext;
  const [editNoteState, setEditNoteState] = useState(editNoteInteractor.state);

  useEffect(() => {
    const dispose = editNoteInteractor.observe(setEditNoteState);
    return dispose;
  }, [editNoteInteractor]);

  return [editNoteState, editNoteInteractor];
}

function useShowNoteInteractor(): [ShowNoteState, ShowNoteInteractor] {
  const { noteContext } = useAppContext();
  const { showNoteInteractor } = noteContext;
  const [showNoteState, setShowNoteState] = useState(showNoteInteractor.state);

  useEffect(() => {
    const dispose = showNoteInteractor.observe(setShowNoteState);
    return dispose;
  }, [showNoteState, showNoteInteractor]);

  return [showNoteState, showNoteInteractor];
}

export const NoteProvider: React.FC = ({ children }) => {
  const [listNoteState, listNoteInteractor] = useListNoteInteractor();
  const [removeNoteState, removeNoteInteractor] = useRemoveNoteInteractor();
  const [editNoteState, editNoteInteractor] = useEditNoteInteractor();
  const [showNoteState, showNoteInteractor] = useShowNoteInteractor();

  return (
    <NoteReactContext.Provider
      value={{
        listNoteState,
        listNoteInteractor,
        showNoteState,
        showNoteInteractor,
        editNoteState,
        editNoteInteractor,
        removeNoteState,
        removeNoteInteractor,
      }}
    >
      {children}
    </NoteReactContext.Provider>
  );
};

export const useNoteContext = () => useContext(NoteReactContext);
