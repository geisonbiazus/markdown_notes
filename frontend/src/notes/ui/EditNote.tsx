import React, { ChangeEvent, SyntheticEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNoteContext } from './NoteContext';
import { Form, FormRow, TextField, TextArea, Button, Loading } from '../../shared/components';
import { useAsyncAction } from '../../shared/hooks';
import { useTranslation } from 'react-i18next';

export const EditNote: React.FC = () => {
  const { editNoteState, saveNote, getNote, setTitle, setBody } = useNoteContext();
  const { id } = useParams();
  const { t } = useTranslation();

  const { pending: getNotePending, execute: getNoteAction } = useAsyncAction(getNote);
  const { pending: saveNotePending, execute: saveNoteAction } = useAsyncAction(saveNote);

  const { title, body } = editNoteState.note;

  useEffect(() => {
    getNoteAction(id);
  }, [getNoteAction, id]);

  if (getNotePending) {
    return <Loading />;
  }

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    await saveNoteAction();
  };

  return (
    <Form onSubmit={onSubmit}>
      <FormRow>
        <TextField
          label={t('Title')}
          placeholder={t('Enter title')}
          value={title}
          onChange={onChangeTitle}
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
          onChange={onChangeBody}
          rows={20}
          errorField="body"
          errorType={editNoteState.errors.body}
          disabled={saveNotePending}
        />
      </FormRow>
      <Button variant="primary" type="submit" loading={saveNotePending} disabled={saveNotePending}>
        {t('Save')}
      </Button>
    </Form>
  );
};
