import React, { useEffect } from 'react';
import { NewNoteButton } from './NewNoteButton';
import { useNoteContext } from './NoteContext';
import { VerticalNav, NavItem, NavIcon, ConfirmModal, Loading } from '../../shared/components';
import { useTranslation } from 'react-i18next';
import { useAsyncAction } from '../../shared/hooks';

export const NoteList: React.FC = () => {
  const { listNoteState, editNoteState, getNotes, requestNoteRemoval } = useNoteContext();

  const { pending: getNotesPending, execute: getNotesAction } = useAsyncAction(getNotes);

  useEffect(() => {
    getNotesAction();
  }, [getNotesAction]);

  return (
    <>
      <RemoveNoteConfirmModal />
      <NewNoteButton />
      <VerticalNav>
        {getNotesPending ? (
          <Loading />
        ) : (
          listNoteState.notes.map((note) => (
            <NavItem
              key={note.id}
              text={note.title}
              href={`/notes/${note.id}`}
              active={note.id === editNoteState.note.id}
            >
              <NavIcon onClick={() => requestNoteRemoval(note)} />
            </NavItem>
          ))
        )}
      </VerticalNav>
    </>
  );
};

export interface RemoveNoteConfirmModalProps {}

export const RemoveNoteConfirmModal: React.FC = () => {
  const { t } = useTranslation();
  const { removeNoteState, cancelNoteRemoval, confirmNoteRemoval } = useNoteContext();

  const { pending: confirmPending, execute: confirmAction } = useAsyncAction(confirmNoteRemoval);

  return (
    <ConfirmModal
      open={removeNoteState.promptConfirmation}
      title={t('Remove note')}
      message={t('Are you sure you want to remove the note "{{name}}"?', {
        name: removeNoteState.note?.title,
      })}
      confirmLabel={t('Remove note')}
      onCancel={cancelNoteRemoval}
      onConfirm={confirmAction}
      confirmPending={confirmPending}
    />
  );
};
