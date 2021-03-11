import { ValidationError } from '../../shared/entities/ValidationError';
import { uuid } from '../../shared/utils/uuid';
import { MarkedMarkdownConverter } from '../adapters/markdownConverter/MarkedMarkdownConverter';
import { Note } from '../entities/Note';
import { InMemoryNoteRepository } from '../adapters/repositories/InMemoryNoteRepository';
import { SaveNoteUseCase } from './SaveNoteUseCase';

describe('SaveNoteUseCase', () => {
  let useCase: SaveNoteUseCase;
  let repo: InMemoryNoteRepository;
  let converter: MarkedMarkdownConverter;

  beforeEach(() => {
    repo = new InMemoryNoteRepository();
    converter = new MarkedMarkdownConverter();
    useCase = new SaveNoteUseCase(repo, converter);
  });

  describe('run', () => {
    it('validates required ID', async () => {
      const userId = uuid();
      const params = { id: '', title: 'Title', body: 'Body', userId };
      const response = {
        status: 'validation_error',
        validationErrors: [new ValidationError('id', 'required')],
      };

      expect(await useCase.run(params)).toEqual(response);
    });

    it('validates required title', async () => {
      const userId = uuid();
      const params = { id: uuid(), title: '', body: 'Body', userId };
      const response = {
        status: 'validation_error',
        validationErrors: [new ValidationError('title', 'required')],
      };

      expect(await useCase.run(params)).toEqual(response);
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

      expect(await useCase.run(params)).toEqual(response);
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

      expect(await useCase.run(params)).toEqual(response);
    });

    it('creates a new note', async () => {
      const noteId = uuid();
      const userId = uuid();
      const params = { id: noteId, title: 'Title', body: 'body', userId };
      const response = {
        status: 'success',
        note: new Note({ id: noteId, title: 'Title', body: 'body', html: '<p>body</p>\n', userId }),
      };

      expect(await useCase.run(params)).toEqual(response);
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

      await useCase.run(request);

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

      expect(await useCase.run(params)).toEqual(response);
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

      expect(await useCase.run(params)).toEqual(response);
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

      await useCase.run(request1);

      expect(await useCase.run(request2)).toEqual({
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

      await useCase.run(request1);
      await useCase.run(request2);

      expect(await repo.getNoteById(noteId1)).toEqual(expectedNote1);
      expect(await repo.getNoteById(noteId2)).toEqual(expectedNote2);
    });
  });
});
