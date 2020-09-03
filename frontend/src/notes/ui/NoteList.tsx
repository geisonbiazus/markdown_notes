import React, { useEffect } from 'react';
import { NewNoteButton } from './NewNoteButton';
import { useNoteContext } from './NoteContext';
import { VerticalNav, NavItem, NavIcon } from '../../shared/components';

export const NoteList: React.FC = () => {
  const { listNoteState, editNoteState, getNotes } = useNoteContext();

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <>
      <NewNoteButton />
      <VerticalNav>
        {listNoteState.notes.map((note) => (
          <NavItem
            key={note.id}
            text={note.title}
            href={`/notes/${note.id}`}
            active={note.id === editNoteState.note.id}
          >
            <NavIcon />
          </NavItem>
        ))}
      </VerticalNav>
    </>
  );
};
