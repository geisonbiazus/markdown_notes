import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../shared/components/ConfirmModal';
import { Loading } from '../../shared/components/Loading';
import { NavIcon, NavItem, VerticalNav } from '../../shared/components/Nav';
import { useNoteContext } from '../NoteReactContext';
import { NewNoteButton } from './NewNoteButton';

export const NoteList: React.FC = () => {
  const { listNoteState, listNoteInteractor, removeNoteInteractor } = useNoteContext();

  useEffect(() => {
    listNoteInteractor.getNotes();
  }, [listNoteInteractor]);

  return (
    <>
      <RemoveNoteConfirmModal />
      <NewNoteButton />
      <VerticalNav>
        {listNoteState.getNotesPending ? (
          <Loading />
        ) : (
          listNoteState.notes.map((note) => (
            <NavItem
              key={note.id}
              text={note.title}
              href={`/notes/${note.id}`}
              active={note.id === listNoteState.activeNoteId}
            >
              <NavIcon onClick={() => removeNoteInteractor.requestNoteRemoval(note)} />
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
  const { removeNoteState, removeNoteInteractor } = useNoteContext();

  return (
    <ConfirmModal
      open={removeNoteState.promptConfirmation}
      title={t('Remove note')}
      message={t('Are you sure you want to remove the note "{{name}}"?', {
        name: removeNoteState.note?.title,
      })}
      confirmLabel={t('Remove note')}
      onCancel={removeNoteInteractor.cancelNoteRemoval}
      onConfirm={removeNoteInteractor.confirmNoteRemoval}
      confirmPending={removeNoteState.confirmNoteRemovalPending}
    />
  );
};
