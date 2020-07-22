import { NoteInteractor, CreateNoteRequest, CreateNoteResponse } from './NoteInteractor';
import { uuid } from './utils';
import { Note } from './entities';
import { ValidationError } from './commons';

describe('NoteInteractor', () => {
  describe('createNote', () => {
    it('creates a new note', () => {
      const noteInteractor = new NoteInteractor();
      const noteId = uuid();
      const params = new CreateNoteRequest({ id: noteId, title: 'Title', body: 'body' });
      const response = createNoteSuccessResponse(
        new Note({ id: noteId, title: 'Title', body: 'body' })
      );

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('validates required id', () => {
      const noteInteractor = new NoteInteractor();
      const params = new CreateNoteRequest({ id: '', title: 'Title', body: 'Body' });
      const response = createNoteErrorResponse([{ field: 'id', type: 'required' }]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('validates required title', () => {
      const noteInteractor = new NoteInteractor();
      const params = new CreateNoteRequest({ id: uuid(), title: '', body: 'Body' });
      const response = createNoteErrorResponse([{ field: 'title', type: 'required' }]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('returns all invalid fields', () => {
      const noteInteractor = new NoteInteractor();
      const params = new CreateNoteRequest({ id: '', title: '', body: 'Body' });
      const response = createNoteErrorResponse([
        { field: 'id', type: 'required' },
        { field: 'title', type: 'required' },
      ]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });
  });
});

function createNoteSuccessResponse(note: Note): CreateNoteResponse {
  return new CreateNoteResponse({
    status: 'success',
    data: note,
  });
}

function createNoteErrorResponse(errors: ValidationError<CreateNoteRequest>[]): CreateNoteResponse {
  return new CreateNoteResponse({
    status: 'error',
    errors: errors,
  });
}
