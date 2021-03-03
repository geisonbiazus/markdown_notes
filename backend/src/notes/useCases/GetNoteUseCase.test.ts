import { uuid } from '../../utils/uuid';
import { Note } from '../entities/Note';
import { InMemoryNoteRepository } from '../repositories/InMemoryNoteRepository';
import { GetNoteUseCase } from './GetNoteUseCase';

describe('GetNoteUseCase', () => {
  let useCase: GetNoteUseCase;
  let repo: InMemoryNoteRepository;

  beforeEach(() => {
    repo = new InMemoryNoteRepository();
    useCase = new GetNoteUseCase(repo);
  });

  describe('run', () => {
    it('returns null when note does not exist', async () => {
      expect(await useCase.run(uuid(), uuid())).toBeNull();
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

      expect(await useCase.run(userId, note.id)).toEqual(note);
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

      expect(await useCase.run(userId, note.id)).toBeNull();
    });
  });
});
