import { uuid } from '../../utils';
import { ValidationError } from '../../utils/validations';
import { Note } from '../entities';
import { InMemoryNoteRepository } from '../repositories';
import { NoteInteractor } from './NoteInteractor';

describe('NoteInteractor', () => {
  let noteInteractor: NoteInteractor;
  let repo: InMemoryNoteRepository;

  beforeEach(() => {
    repo = new InMemoryNoteRepository();
    noteInteractor = new NoteInteractor(repo);
  });

  describe('saveNote', () => {
    it('validates required ID', async () => {
      const params = { id: '', title: 'Title', body: 'Body' };
      const response = {
        status: 'validation_error',
        validationErrors: [new ValidationError('id', 'required')],
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('validates required title', async () => {
      const params = { id: uuid(), title: '', body: 'Body' };
      const response = {
        status: 'validation_error',
        validationErrors: [new ValidationError('title', 'required')],
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('returns all invalid fields', async () => {
      const params = { id: '', title: '', body: 'Body' };
      const response = {
        status: 'validation_error',
        validationErrors: [
          new ValidationError('id', 'required'),
          new ValidationError('title', 'required'),
        ],
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('creates a new note', async () => {
      const noteId = uuid();
      const params = { id: noteId, title: 'Title', body: 'body' };
      const response = {
        status: 'success',
        note: new Note({ id: noteId, title: 'Title', body: 'body' }),
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('persists the created note', async () => {
      const noteId = uuid();
      const expectedNote = new Note({ id: noteId, title: 'Title', body: 'body' });
      const request = { id: noteId, title: 'Title', body: 'body' };

      await noteInteractor.saveNote(request);

      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });

    it('updates the note when it already exists', async () => {
      const noteId = uuid();
      const expectedNote = new Note({ id: noteId, title: 'Title 2', body: 'Body 2' });
      const request1 = { id: noteId, title: 'Title 1', body: 'Body 1' };
      const request2 = { id: noteId, title: 'Title 2', body: 'Body 2' };

      await noteInteractor.saveNote(request1);

      expect(await noteInteractor.saveNote(request2)).toEqual({
        status: 'success',
        note: expectedNote,
      });

      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });

    it('stores different IDs independently', async () => {
      const noteId1 = uuid();
      const noteId2 = uuid();
      const expectedNote1 = new Note({ id: noteId1, title: 'Title', body: 'Body' });
      const expectedNote2 = new Note({ id: noteId2, title: 'Title', body: 'Body' });
      const request1 = { id: noteId1, title: 'Title', body: 'Body' };
      const request2 = { id: noteId2, title: 'Title', body: 'Body' };

      await noteInteractor.saveNote(request1);
      await noteInteractor.saveNote(request2);

      expect(await repo.getNoteById(noteId1)).toEqual(expectedNote1);
      expect(await repo.getNoteById(noteId2)).toEqual(expectedNote2);
    });
  });

  describe('getNote', () => {
    it('returns null when note does not exist', async () => {
      expect(await noteInteractor.getNote(uuid())).toBeNull();
    });

    it('returns note when it exists', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });

      repo.saveNote(note);

      expect(await noteInteractor.getNote(note.id)).toEqual(note);
    });
  });

  describe('getNotes', () => {
    it('returns an empty list when there is no note', async () => {
      expect(await noteInteractor.getNotes()).toEqual([]);
    });

    it('returns a note when it is saved', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });

      repo.saveNote(note);

      expect(await noteInteractor.getNotes()).toEqual([note]);
    });

    it('returns a list of notes sorted alphabetically', async () => {
      const note1 = new Note({ id: uuid(), title: 'Note B', body: 'body' });
      const note2 = new Note({ id: uuid(), title: 'Note C', body: 'body' });
      const note3 = new Note({ id: uuid(), title: 'Note A', body: 'body' });

      repo.saveNote(note1);
      repo.saveNote(note2);
      repo.saveNote(note3);

      expect(await noteInteractor.getNotes()).toEqual([note3, note1, note2]);
    });
  });

  describe('removeNote', () => {
    it('returns false when note does not exit', async () => {
      expect(await noteInteractor.removeNote(uuid())).toBeFalsy();
    });

    it('returns true and removes the note when it exists', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });
      repo.saveNote(note);

      expect(await noteInteractor.removeNote(note.id)).toBeTruthy();
      expect(await repo.getNoteById(note.id)).toEqual(null);
    });
  });
});
