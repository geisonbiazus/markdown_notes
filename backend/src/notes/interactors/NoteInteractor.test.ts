import { uuid } from '../../utils';
import { ValidationError } from '../../utils/validations';
import { MarkdownConverter, Note } from '../entities';
import { InMemoryNoteRepository } from '../repositories';
import { NoteInteractor } from './NoteInteractor';

describe('NoteInteractor', () => {
  let noteInteractor: NoteInteractor;
  let repo: InMemoryNoteRepository;
  let converter: MarkdownConverter;

  beforeEach(() => {
    repo = new InMemoryNoteRepository();
    converter = new MarkdownConverter();
    noteInteractor = new NoteInteractor(repo, converter);
  });

  describe('saveNote', () => {
    it('validates required ID', async () => {
      const userId = uuid();
      const params = { id: '', title: 'Title', body: 'Body', userId };
      const response = {
        status: 'validation_error',
        validationErrors: [new ValidationError('id', 'required')],
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('validates required title', async () => {
      const userId = uuid();
      const params = { id: uuid(), title: '', body: 'Body', userId };
      const response = {
        status: 'validation_error',
        validationErrors: [new ValidationError('title', 'required')],
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('returns all invalid fields', async () => {
      const userId = uuid();
      const params = { id: '', title: '', body: 'Body', userId };
      const response = {
        status: 'validation_error',
        validationErrors: [
          new ValidationError('id', 'required'),
          new ValidationError('title', 'required'),
        ],
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('validates presence of undefined fields', async () => {
      const userId = uuid();
      const params = { id: undefined, title: undefined, body: undefined, userId };
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
      const userId = uuid();
      const params = { id: noteId, title: 'Title', body: 'body', userId };
      const response = {
        status: 'success',
        note: new Note({ id: noteId, title: 'Title', body: 'body', html: '<p>body</p>\n', userId }),
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('persists the created note', async () => {
      const userId = uuid();
      const noteId = uuid();
      const expectedNote = new Note({
        id: noteId,
        title: 'Title',
        body: 'body',
        html: '<p>body</p>\n',
        userId,
      });
      const request = { id: noteId, title: 'Title', body: 'body', userId };

      await noteInteractor.saveNote(request);

      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });

    it('converts body markdown to HTML', async () => {
      const noteId = uuid();
      const userId = uuid();
      const params = { id: noteId, title: 'Title', body: '# Body', userId };
      const response = {
        status: 'success',
        note: new Note({
          id: noteId,
          title: 'Title',
          body: '# Body',
          html: '<h1>Body</h1>\n',
          userId,
        }),
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('works when not sending body', async () => {
      const noteId = uuid();
      const userId = uuid();
      const params = { id: noteId, title: 'Title', userId };
      const response = {
        status: 'success',
        note: new Note({
          id: noteId,
          title: 'Title',
          body: '',
          html: '',
          userId,
        }),
      };

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('updates the note when it already exists', async () => {
      const noteId = uuid();
      const userId = uuid();
      const expectedNote = new Note({
        id: noteId,
        title: 'Title 2',
        body: 'Body 2',
        html: '<p>Body 2</p>\n',
        userId,
      });
      const request1 = { id: noteId, title: 'Title 1', body: 'Body 1', userId };
      const request2 = { id: noteId, title: 'Title 2', body: 'Body 2', userId };

      await noteInteractor.saveNote(request1);

      expect(await noteInteractor.saveNote(request2)).toEqual({
        status: 'success',
        note: expectedNote,
      });

      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });

    it('stores different IDs independently', async () => {
      const userId = uuid();
      const noteId1 = uuid();
      const noteId2 = uuid();
      const expectedNote1 = new Note({
        id: noteId1,
        title: 'Title',
        body: 'Body',
        html: '<p>Body</p>\n',
        userId,
      });
      const expectedNote2 = new Note({
        id: noteId2,
        title: 'Title',
        body: 'Body',
        html: '<p>Body</p>\n',
        userId,
      });
      const request1 = { id: noteId1, title: 'Title', body: 'Body', userId };
      const request2 = { id: noteId2, title: 'Title', body: 'Body', userId };

      await noteInteractor.saveNote(request1);
      await noteInteractor.saveNote(request2);

      expect(await repo.getNoteById(noteId1)).toEqual(expectedNote1);
      expect(await repo.getNoteById(noteId2)).toEqual(expectedNote2);
    });
  });

  describe('getNote', () => {
    it('returns null when note does not exist', async () => {
      expect(await noteInteractor.getNote(uuid(), uuid())).toBeNull();
    });

    it('returns note when it exists', async () => {
      const userId = uuid();
      const note = new Note({
        id: uuid(),
        title: 'title',
        body: 'body',
        html: '<p>body</p>',
        userId,
      });

      repo.saveNote(note);

      expect(await noteInteractor.getNote(userId, note.id)).toEqual(note);
    });

    it('returns null when note belongs to another user', async () => {
      const userId = uuid();
      const note = new Note({
        id: uuid(),
        title: 'title',
        body: 'body',
        html: '<p>body</p>',
        userId: uuid(),
      });

      repo.saveNote(note);

      expect(await noteInteractor.getNote(userId, note.id)).toBeNull();
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
      const note1 = new Note({ id: uuid(), title: 'Note B', body: 'body', html: '<p>body</p>' });
      const note2 = new Note({ id: uuid(), title: 'Note C', body: 'body', html: '<p>body</p>' });
      const note3 = new Note({ id: uuid(), title: 'Note A', body: 'body', html: '<p>body</p>' });

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
