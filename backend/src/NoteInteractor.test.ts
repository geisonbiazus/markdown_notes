import {
  NoteInteractor,
  Note,
  CreateNoteParams,
  CreateNoteResponse,
  ValidationError,
} from './NoteInteractor';
import { uuid } from './utils';

describe('NoteInteractor', () => {
  describe('createNote', () => {
    it('creates a new note', () => {
      const noteInteractor = new NoteInteractor();
      const noteId = uuid();
      const params = new CreateNoteParams({ id: noteId, title: 'Title', body: 'body' });
      const response = createNoteSuccessResponse(
        new Note({ id: noteId, title: 'Title', body: 'body' })
      );

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('validates required id', () => {
      const noteInteractor = new NoteInteractor();
      const params = new CreateNoteParams({ id: '', title: 'Title', body: 'Body' });
      const response = createNoteErrorResponse([{ field: 'id', type: 'required' }]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('validates required title', () => {
      const noteInteractor = new NoteInteractor();
      const params = new CreateNoteParams({ id: uuid(), title: '', body: 'Body' });
      const response = createNoteErrorResponse([{ field: 'title', type: 'required' }]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('returns all invalid fields', () => {
      const noteInteractor = new NoteInteractor();
      const params = new CreateNoteParams({ id: '', title: '', body: 'Body' });
      const response = createNoteErrorResponse([
        { field: 'id', type: 'required' },
        { field: 'title', type: 'required' },
      ]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });
  });
});

function createNoteSuccessResponse(note: Note): CreateNoteResponse {
  return {
    status: 'success',
    data: note,
  };
}

function createNoteErrorResponse(errors: ValidationError<CreateNoteParams>[]): CreateNoteResponse {
  return {
    status: 'error',
    errors: errors,
  };
}
