import React, { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NewNoteButton } from './NewNoteButton';
import './NoteList.css';
import { useNoteContext } from './NoteContext';

export const NoteList: React.FC = () => {
  const { listNoteState, editNoteState, getNotes } = useNoteContext();

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <div className="note-list-container">
      <NewNoteButton />
      <Nav defaultActiveKey="/home" className="flex-column" as="ul">
        {listNoteState.notes.map((note) => (
          <Nav.Item as="li">
            <Nav.Link active={note.id === editNoteState.note.id} as={Link} to={`/notes/${note.id}`}>
              {note.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};
