import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NewNoteButton } from './NewNoteButton';

export const NoteList: React.FC = () => {
  return (
    <>
      <NewNoteButton />
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Item>
          <Link to="/notes/123">Note 1</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/notes/123">Note 1</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/notes/123">Note 1</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/notes/123">Note 1</Link>
        </Nav.Item>
      </Nav>
    </>
  );
};
