import { TypeORMRepository } from './TypeORMRepository';
import { Note } from '../entities';
import { uuid } from '../../utils';
import { createConnection } from 'typeorm';

describe('TypeORMRespository', () => {
  let repository: TypeORMRepository;

  beforeEach(async () => {
    const connection = await createConnection();

    repository = new TypeORMRepository(connection);
  });

  describe('saveNote', () => {
    it('saves the note in the DB when it does not exist', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });
      await repository.saveNote(note);

      expect(await repository.getNoteById(note.id)).toEqual(note);
    });
  });
});
