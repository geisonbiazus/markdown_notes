import { TypeORMNoteRepository } from './TypeORMNoteRepository';
import { Note } from '../entities';
import { uuid, connect, disconnect, dbTest } from '../../utils';

describe('TypeORMNoteRespository', () => {
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
        const repository = new TypeORMNoteRepository(entityManager);
        const note = new Note({ id: uuid(), title: 'title', body: 'body', html: '<p>note</p>' });
        await repository.saveNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(note);
      })
    );

    it(
      'updates the note in the DB when it does exists',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);
        const note = new Note({ id: uuid(), title: 'title', body: 'body', html: '<p>note</p>' });
        await repository.saveNote(note);

        const updatedNote = new Note({ ...note, title: 'updated title' });

        await repository.saveNote(updatedNote);

        expect(await repository.getNoteById(note.id)).toEqual(updatedNote);
      })
    );

    it(
      'saves multiple notes',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);

        const note1 = new Note({ id: uuid(), title: 'title 1', body: 'body', html: '<p>note</p>' });
        const note2 = new Note({ id: uuid(), title: 'title 2', body: 'body', html: '<p>note</p>' });
        const note3 = new Note({ id: uuid(), title: 'title 3', body: 'body', html: '<p>note</p>' });

        await repository.saveNote(note1);
        await repository.saveNote(note2);
        await repository.saveNote(note3);

        expect(await repository.getNoteById(note1.id)).toEqual(note1);
        expect(await repository.getNoteById(note2.id)).toEqual(note2);
        expect(await repository.getNoteById(note3.id)).toEqual(note3);
      })
    );
  });

  describe('getNoteById', () => {
    it(
      'return null when note does not exist',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);
        expect(await repository.getNoteById(uuid())).toEqual(null);
      })
    );

    it(
      'returns the note of the given ID',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);
        const note = new Note({ id: uuid(), title: 'title', body: 'body', html: '<p>note</p>' });
        await repository.saveNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(note);
      })
    );
  });

  describe('getNotesSortedByTitle', () => {
    it(
      'returns a list of all notes sorted by title',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);

        const note1 = new Note({ id: uuid(), title: 'title 3', body: 'body', html: '<p>note</p>' });
        const note2 = new Note({ id: uuid(), title: 'title 1', body: 'body', html: '<p>note</p>' });
        const note3 = new Note({ id: uuid(), title: 'title 2', body: 'body', html: '<p>note</p>' });

        await repository.saveNote(note1);
        await repository.saveNote(note2);
        await repository.saveNote(note3);

        expect(await repository.getNotesSortedByTitle()).toEqual([note2, note3, note1]);
      })
    );
  });

  describe('removeNote', () => {
    it(
      'removes the note',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);

        const note = new Note({ id: uuid(), title: 'title', body: 'body', html: '<p>note</p>' });
        await repository.saveNote(note);

        await repository.removeNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(null);
      })
    );

    it(
      'does not break if the record does not exist',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);
        const note = new Note({ id: uuid(), title: 'title', body: 'body', html: '<p>note</p>' });

        await repository.removeNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(null);
      })
    );
  });
});
