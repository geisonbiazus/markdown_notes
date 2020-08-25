import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NewNoteButton } from './NewNoteButton';
import './NoteList.css';

export const NoteList: React.FC = () => {
  return (
    <div className="note-list-container">
      <NewNoteButton />
      <Nav defaultActiveKey="/home" className="flex-column" as="ul">
        <Nav.Item as="li">
          <Nav.Link active={true} as={Link} to="/notes/123">
            Note 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link as={Link} to="/notes/123">
            Note 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link as={Link} to="/notes/123">
            Note 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link as={Link} to="/notes/123">
            Note 1
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};
