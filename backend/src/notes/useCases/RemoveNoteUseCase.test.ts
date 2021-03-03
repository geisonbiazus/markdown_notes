import { uuid } from '../../utils/uuid';
import { Note } from '../entities/Note';
import { InMemoryNoteRepository } from '../repositories/InMemoryNoteRepository';
import { RemoveNoteUseCase } from './RemoveNoteUseCase';

describe('RemoveNoteUseCase', () => {
  let useCase: RemoveNoteUseCase;
  let repo: InMemoryNoteRepository;

  beforeEach(() => {
    repo = new InMemoryNoteRepository();
    useCase = new RemoveNoteUseCase(repo);
  });

  describe('run', () => {
    it('returns false when note does not exit', async () => {
      expect(await useCase.run(uuid())).toBeFalsy();
    });

    it('returns true and removes the note when it exists', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });
      repo.saveNote(note);

      expect(await useCase.run(note.id)).toBeTruthy();
      expect(await repo.getNoteById(note.id)).toEqual(null);
    });
  });
});
