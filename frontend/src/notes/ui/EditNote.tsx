import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import { Button } from '../../shared/ui/components/Button';
import { Form, FormRow, TextArea, TextField } from '../../shared/ui/components/Form';
import { Loading } from '../../shared/ui/components/Loading';
import { useNoteContext } from '../NoteReactContext';

export const EditNote: React.FC = () => {
  const { editNoteState, editNoteStore } = useNoteContext();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const history = useHistory();

  const { title, body } = editNoteState.note;

  useEffect(() => {
    editNoteStore.getNote(id);
  }, [editNoteStore, id]);

  const saveAndClose = async () => {
    if (await editNoteStore.saveNote()) {
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
      <Form onSubmit={editNoteStore.saveNote}>
        <FormRow>
          <TextField
            label={t('Title')}
            placeholder={t('Enter title')}
            value={title}
            onChange={editNoteStore.setTitle}
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
            onChange={editNoteStore.setBody}
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
