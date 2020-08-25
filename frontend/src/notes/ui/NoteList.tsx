import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { uuid } from '../../utils';
import { Button } from '../../shared/components';

export const NoteList: React.FC = () => {
  const history = useHistory();

  const newNote = () => {
    history.push(`/notes/${uuid()}`);
  };

  return (
    <>
      <Button variant="primary" onClick={newNote}>
        New Note
      </Button>
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
