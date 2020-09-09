import { TypeORMRepository } from './TypeORMRepository';
import { Note } from '../entities';
import { uuid } from '../../utils';
import { createConnection, Connection } from 'typeorm';
import { NoteDB } from './typeORM/entities/NoteDB';

describe('TypeORMRespository', () => {
  let repository: TypeORMRepository;
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  afterAll(async () => {
    connection.close();
  });

  beforeEach(async () => {
    repository = new TypeORMRepository(connection);

    await connection.createQueryBuilder().delete().from(NoteDB).execute();
  });

  describe('saveNote', () => {
    it('saves the note in the DB when it does not exist', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });
      await repository.saveNote(note);

      expect(await repository.getNoteById(note.id)).toEqual(note);
    });
  });

  describe('getNotesSortedByTitle', () => {
    it('returns a list of all notes sorted by title', async () => {
      const note1 = new Note({ id: uuid(), title: 'title 3', body: 'body' });
      const note2 = new Note({ id: uuid(), title: 'title 1', body: 'body' });
      const note3 = new Note({ id: uuid(), title: 'title 2', body: 'body' });

      await repository.saveNote(note1);
      await repository.saveNote(note2);
      await repository.saveNote(note3);

      expect(await repository.getNotesSortedByTitle()).toEqual([note2, note3, note1]);
    });
  });
});
