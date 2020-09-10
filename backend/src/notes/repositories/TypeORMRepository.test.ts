import { TypeORMRepository } from './TypeORMRepository';
import { Note } from '../entities';
import { uuid, connect, disconnect, dbTest } from '../../utils';
import { createConnection, Connection, EntityManager, getConnection } from 'typeorm';

describe('TypeORMRespository', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('saveNote', () => {
    it(
      'saves the note in the DB when it does not exist',
      dbTest(async (entityManager) => {
        const repository = new TypeORMRepository(entityManager);
        const note = new Note({ id: uuid(), title: 'title', body: 'body' });
        await repository.saveNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(note);
      })
    );
  });

  describe('getNotesSortedByTitle', () => {
    it(
      'returns a list of all notes sorted by title',
      dbTest(async (entityManager) => {
        const repository = new TypeORMRepository(entityManager);

        const note1 = new Note({ id: uuid(), title: 'title 3', body: 'body' });
        const note2 = new Note({ id: uuid(), title: 'title 1', body: 'body' });
        const note3 = new Note({ id: uuid(), title: 'title 2', body: 'body' });

        await repository.saveNote(note1);
        await repository.saveNote(note2);
        await repository.saveNote(note3);

        expect(await repository.getNotesSortedByTitle()).toEqual([note2, note3, note1]);
      })
    );
  });
});
