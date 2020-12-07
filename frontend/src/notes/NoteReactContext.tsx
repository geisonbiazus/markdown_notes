import React, { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../app';
import {
  EditNoteInteractor,
  EditNoteState,
  ListNoteInteractor,
  ListNoteState,
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

const NoteReactContext = React.createContext<NoteContextValue>(null!);

function useListNoteInteractor(): [ListNoteState, ListNoteInteractor] {
  const { pubSub, noteContext } = useAppContext();
  const { listNoteInteractor } = noteContext;
  const [listNoteState, setListNoteState] = useState(listNoteInteractor.state);

  useEffect(() => {
    const disposeStateOberver = listNoteInteractor.observe(setListNoteState);
    const disposeNoteSaved = pubSub.subscribe('note_saved', () => listNoteInteractor.getNotes());
    const disposeNoteRemoved = pubSub.subscribe('note_removed', () =>
      listNoteInteractor.getNotes()
    );

    return () => {
      disposeStateOberver();
      disposeNoteSaved();
      disposeNoteRemoved();
    };
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

export const NoteProvider: React.FC = ({ children }) => {
  const [listNoteState, listNoteInteractor] = useListNoteInteractor();
  const [removeNoteState, removeNoteInteractor] = useRemoveNoteInteractor();
  const [editNoteState, editNoteInteractor] = useEditNoteInteractor();

  return (
    <NoteReactContext.Provider
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
    </NoteReactContext.Provider>
  );
};

export const useNoteContext = () => useContext(NoteReactContext);
