import React, { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../app/AppReactContext';
import { EditNoteStore, EditNoteState } from './stores/EditNoteStore';
import { ListNoteStore, ListNoteState } from './stores/ListNoteStore';
import { RemoveNoteStore, RemoveNoteState } from './stores/RemoveNoteStore';
import { ShowNoteStore, ShowNoteState } from './stores/ShowNoteStore';

export interface NoteContextValue {
  listNoteState: ListNoteState;
  listNoteStore: ListNoteStore;
  showNoteState: ShowNoteState;
  showNoteStore: ShowNoteStore;
  editNoteState: EditNoteState;
  editNoteStore: EditNoteStore;
  removeNoteState: RemoveNoteState;
  removeNoteStore: RemoveNoteStore;
}

const NoteReactContext = React.createContext<NoteContextValue>(null!);

function useListNoteStore(): [ListNoteState, ListNoteStore] {
  const { pubSub, noteContext } = useAppContext();
  const { listNoteStore } = noteContext;
  const [listNoteState, setListNoteState] = useState(listNoteStore.state);

  useEffect(() => {
    const dispose = listNoteStore.observe(setListNoteState);
    return dispose;
  }, [listNoteStore, pubSub]);

  return [listNoteState, listNoteStore];
}

function useRemoveNoteStore(): [RemoveNoteState, RemoveNoteStore] {
  const { noteContext } = useAppContext();
  const { removeNoteStore } = noteContext;
  const [removeNoteState, setRemoveNoteState] = useState(removeNoteStore.state);

  useEffect(() => {
    const dispose = removeNoteStore.observe(setRemoveNoteState);
    return dispose;
  }, [removeNoteStore]);

  return [removeNoteState, removeNoteStore];
}

function useEditNoteStore(): [EditNoteState, EditNoteStore] {
  const { noteContext } = useAppContext();
  const { editNoteStore } = noteContext;
  const [editNoteState, setEditNoteState] = useState(editNoteStore.state);

  useEffect(() => {
    const dispose = editNoteStore.observe(setEditNoteState);
    return dispose;
  }, [editNoteStore]);

  return [editNoteState, editNoteStore];
}

function useShowNoteStore(): [ShowNoteState, ShowNoteStore] {
  const { noteContext } = useAppContext();
  const { showNoteStore } = noteContext;
  const [showNoteState, setShowNoteState] = useState(showNoteStore.state);

  useEffect(() => {
    const dispose = showNoteStore.observe(setShowNoteState);
    return dispose;
  }, [showNoteState, showNoteStore]);

  return [showNoteState, showNoteStore];
}

export const NoteProvider: React.FC = ({ children }) => {
  const [listNoteState, listNoteStore] = useListNoteStore();
  const [removeNoteState, removeNoteStore] = useRemoveNoteStore();
  const [editNoteState, editNoteStore] = useEditNoteStore();
  const [showNoteState, showNoteStore] = useShowNoteStore();

  return (
    <NoteReactContext.Provider
      value={{
        listNoteState,
        listNoteStore,
        showNoteState,
        showNoteStore,
        editNoteState,
        editNoteStore,
        removeNoteState,
        removeNoteStore,
      }}
    >
      {children}
    </NoteReactContext.Provider>
  );
};

export const useNoteContext = () => useContext(NoteReactContext);
