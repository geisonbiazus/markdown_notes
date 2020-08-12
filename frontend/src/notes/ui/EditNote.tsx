import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useNote } from './NoteContext';
import { ErrorMessage } from '../../shared/components';
import { Form, Button } from 'react-bootstrap';

export const EditNote: React.FC = () => {
  const { editNoteState, saveNote } = useNote();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { id } = useParams();

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    saveNote({
      id,
      title,
      body,
    });
  };

  return (
    <>
      <Form noValidate onSubmit={onSubmit}>
        <Form.Group controlId="validationFormik02">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={onChangeTitle}
            isInvalid={!!editNoteState.errors.title}
          />
          <ErrorMessage field="title" type={editNoteState.errors.title} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter content"
            rows={20}
            value={body}
            onChange={onChangeBody}
            isInvalid={!!editNoteState.errors.title}
          />
          <ErrorMessage field="title" type={editNoteState.errors.body} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  );
};
