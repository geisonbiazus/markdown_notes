import React, { useEffect } from 'react';
import { NewNoteButton } from './NewNoteButton';
import { useNoteContext } from './NoteContext';
import { VerticalNav, NavItem, NavIcon, ConfirmModal } from '../../shared/components';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { removeNoteState, cancelNoteRemoval, confirmNoteRemoval } = useNoteContext();

  return (
    <ConfirmModal
      open={removeNoteState.promptConfirmation}
      title={t('Remove note')}
      message={t('Are you sure you want to remove the note "{{name}}"?', {
        name: removeNoteState.note?.title,
      })}
      confirmLabel={t('Remove note')}
      onCancel={cancelNoteRemoval}
      onConfirm={confirmNoteRemoval}
    />
  );
};
