import {
  NoteInteractor,
  Note,
  CreateNoteParams,
  InteractorResponse,
  CreateNoteResponse,
  ValidationError,
} from './NoteInteractor';
import { uuid } from './utils';

describe('NoteInteractor', () => {
  describe('createNote', () => {
    it('creates a new note', () => {
      const noteInteractor = new NoteInteractor();
      const noteId = uuid();
      const params = createNoteParams({ id: noteId, title: 'Title', body: 'body' });
      const response = createNoteSuccessResponse({ id: noteId, title: 'Title', body: 'body' });

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('validates required id', () => {
      const noteInteractor = new NoteInteractor();
      const params = createNoteParams({ id: '', title: 'Title', body: 'Body' });
      const response = createNoteErrorResponse([{ field: 'id', type: 'required' }]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('validates required title', () => {
      const noteInteractor = new NoteInteractor();
      const params = createNoteParams({ id: uuid(), title: '', body: 'Body' });
      const response = createNoteErrorResponse([{ field: 'title', type: 'required' }]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });

    it('returns all invalid fields', () => {
      const noteInteractor = new NoteInteractor();
      const params = createNoteParams({ id: '', title: '', body: 'Body' });
      const response = createNoteErrorResponse([
        { field: 'id', type: 'required' },
        { field: 'title', type: 'required' },
      ]);

      expect(noteInteractor.createNote(params)).toEqual(response);
    });
  });
});

function createNoteParams(params: Partial<CreateNoteParams> = {}): CreateNoteParams {
  return {
    id: params.id || '',
    title: params.title || '',
    body: params.body || '',
  };
}

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
