import React, { useEffect } from 'react';
import { useParams, Prompt, useHistory } from 'react-router-dom';
import { useNoteContext } from '../NoteReactContext';
import { Form, FormRow, TextField, TextArea, Button, Loading } from '../../shared/components';
import { useTranslation } from 'react-i18next';

export const EditNote: React.FC = () => {
  const { editNoteState, editNoteInteractor } = useNoteContext();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const history = useHistory();

  const { title, body } = editNoteState.note;

  useEffect(() => {
    editNoteInteractor.getNote(id);
  }, [editNoteInteractor, id]);

  const saveAndClose = async () => {
    if (await editNoteInteractor.saveNote()) {
      history.push(`/notes/${id}`);
    }
  };

  if (editNoteState.getNotePending) {
    return <Loading />;
  }

  return (
    <>
      <Prompt
        when={editNoteState.isDirty}
        message={t('You have unsaved data, do you want to leave?')}
      />
      <Form onSubmit={editNoteInteractor.saveNote}>
        <FormRow>
          <TextField
            label={t('Title')}
            placeholder={t('Enter title')}
            value={title}
            onChange={editNoteInteractor.setTitle}
            errorField="title"
            errorType={editNoteState.errors.title}
            disabled={editNoteState.saveNotePending}
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
            disabled={editNoteState.saveNotePending}
          />
        </FormRow>
        <Button
          variant="primary"
          type="submit"
          loading={editNoteState.saveNotePending}
          disabled={editNoteState.saveNotePending}
        >
          {t('Save')}
        </Button>{' '}
        <Button
          variant="secondary"
          onClick={saveAndClose}
          loading={editNoteState.saveNotePending}
          disabled={editNoteState.saveNotePending}
        >
          {t('Save and close')}
        </Button>
      </Form>
    </>
  );
};
