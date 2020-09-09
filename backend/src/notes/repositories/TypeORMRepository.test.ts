import { TypeORMRepository } from './TypeORMRepository';
import { Note } from '../entities';
import { uuid } from '../../utils';
import { createConnection, Connection, EntityManager, getConnection } from 'typeorm';

describe('TypeORMRespository', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  afterAll(async () => {
    connection.close();
  });

  describe('saveNote', () => {
    it('saves the note in the DB when it does not exist', async () => {
      await transactionalTest(async (entityManager) => {
        const repository = new TypeORMRepository(entityManager);
        const note = new Note({ id: uuid(), title: 'title', body: 'body' });
        await repository.saveNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(note);
      });
    });
  });

  describe('getNotesSortedByTitle', () => {
    it('returns a list of all notes sorted by title', async () => {
      await transactionalTest(async (entityManager) => {
        const repository = new TypeORMRepository(entityManager);

        const note1 = new Note({ id: uuid(), title: 'title 3', body: 'body' });
        const note2 = new Note({ id: uuid(), title: 'title 1', body: 'body' });
        const note3 = new Note({ id: uuid(), title: 'title 2', body: 'body' });

        await repository.saveNote(note1);
        await repository.saveNote(note2);
        await repository.saveNote(note3);

        expect(await repository.getNotesSortedByTitle()).toEqual([note2, note3, note1]);

        throw new RollbackTransactionError();
      });
    });
  });
});

const transactionalTest = async (callback: (entityManager: EntityManager) => Promise<any>) => {
  try {
    await getConnection().transaction(async (entityManager: EntityManager) => {
      await callback(entityManager);
      throw new RollbackTransactionError();
    });
  } catch (e) {
    const error = e as RollbackTransactionError;
    if (!error.isRollback) throw e;
  }
};

class RollbackTransactionError extends Error {
  public isRollback: boolean;

  constructor() {
    super();
    this.isRollback = true;
  }
}
