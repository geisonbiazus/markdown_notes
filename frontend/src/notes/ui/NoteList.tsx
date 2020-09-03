import React, { useEffect } from 'react';
import { NewNoteButton } from './NewNoteButton';
import { useNoteContext } from './NoteContext';
import { VerticalNav, NavItem, NavIcon } from '../../shared/components';
import { Modal, Button } from 'react-bootstrap';

export const NoteList: React.FC = () => {
  const { listNoteState, editNoteState, getNotes, requestNoteRemoval } = useNoteContext();

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <>
      <RemoveNoteConfirmModal />
      <NewNoteButton />
      <VerticalNav>
        {listNoteState.notes.map((note) => (
          <NavItem
            key={note.id}
            text={note.title}
            href={`/notes/${note.id}`}
            active={note.id === editNoteState.note.id}
          >
            <NavIcon onClick={() => requestNoteRemoval(note)} />
          </NavItem>
        ))}
      </VerticalNav>
    </>
  );
};

export interface RemoveNoteConfirmModalProps {}

export const RemoveNoteConfirmModal: React.FC = () => {
  const handleClose = () => {};

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Remove note</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to remove this note?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleClose}>
          Remove Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
