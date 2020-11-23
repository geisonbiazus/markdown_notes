import React, { useEffect } from 'react';
import { useParams, Prompt } from 'react-router-dom';
import { useNoteContext } from '../NoteContext';
import { Form, FormRow, TextField, TextArea, Button, Loading } from '../../shared/components';
import { useAsyncAction } from '../../shared/hooks';
import { useTranslation } from 'react-i18next';

export const EditNote: React.FC = () => {
  const { editNoteState, editNoteInteractor } = useNoteContext();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { pending: getNotePending, execute: getNoteAction } = useAsyncAction(
    editNoteInteractor.getNote
  );
  const { pending: saveNotePending, execute: saveNoteAction } = useAsyncAction(
    editNoteInteractor.saveNote
  );

  const { title, body } = editNoteState.note;

  useEffect(() => {
    getNoteAction(id);
  }, [getNoteAction, id]);

  if (getNotePending) {
    return <Loading />;
  }

  return (
    <>
      <Prompt
        when={editNoteState.isDirty}
        message={t('You have unsaved data, do you want to leave?')}
      />
      <Form onSubmit={saveNoteAction}>
        <FormRow>
          <TextField
            label={t('Title')}
            placeholder={t('Enter title')}
            value={title}
            onChange={editNoteInteractor.setTitle}
            errorField="title"
            errorType={editNoteState.errors.title}
            disabled={saveNotePending}
          />
        </FormRow>
        <FormRow>
          <TextArea
            label={t('Content')}
            placeholder={t('Enter content')}
            value={body}
            onChange={editNoteInteractor.setBody}
            rows={20}
            errorField="body"
            errorType={editNoteState.errors.body}
            disabled={saveNotePending}
          />
        </FormRow>
        <Button
          variant="primary"
          type="submit"
          loading={saveNotePending}
          disabled={saveNotePending}
        >
          {t('Save')}
        </Button>
      </Form>
    </>
  );
};
