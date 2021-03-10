import { uuid } from '../../shared/utils/uuid';
import { Note } from '../entities/Note';
import { InMemoryNoteRepository } from '../repositories/InMemoryNoteRepository';
import { GetNotesUseCase } from './GetNotesUseCase';

describe('GetNotesUseCase', () => {
  let useCase: GetNotesUseCase;
  let repo: InMemoryNoteRepository;

  beforeEach(() => {
    repo = new InMemoryNoteRepository();
    useCase = new GetNotesUseCase(repo);
  });

  describe('run', () => {
    it('returns an empty list when there is no note', async () => {
      const userId = uuid();
      expect(await useCase.run(userId)).toEqual([]);
    });

    it('returns a note when it is saved', async () => {
      const userId = uuid();
      const note = new Note({ id: uuid(), title: 'title', body: 'body', userId });

      repo.saveNote(note);

      expect(await useCase.run(userId)).toEqual([note]);
    });

    it('returns a list of notes of the give user sorted alphabetically', async () => {
      const userId1 = uuid();
      const userId2 = uuid();

      const note1 = new Note({
        id: uuid(),
        title: 'Note B',
        body: 'body',
        html: '<p>body</p>',
        userId: userId1,
      });
      const note2 = new Note({
        id: uuid(),
        title: 'Note C',
        body: 'body',
        html: '<p>body</p>',
        userId: userId1,
      });
      const note3 = new Note({
        id: uuid(),
        title: 'Note A',
        body: 'body',
        html: '<p>body</p>',
        userId: userId1,
      });
      const note4 = new Note({
        id: uuid(),
        title: 'Note D',
        body: 'body',
        html: '<p>body</p>',
        userId: userId2,
      });

      repo.saveNote(note1);
      repo.saveNote(note2);
      repo.saveNote(note3);
      repo.saveNote(note4);

      expect(await useCase.run(userId1)).toEqual([note3, note1, note2]);
    });
  });
});
