import { connect, dbTest, disconnect } from '../../utils/dbTest';
import { uuid } from '../../utils/uuid';
import { Note } from '../entities/Note';
import { TypeORMNoteRepository } from './TypeORMNoteRepository';

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
        const note = new Note({
          id: uuid(),
          title: 'title',
          body: 'body',
          html: '<p>note</p>',
          userId: uuid(),
        });
        await repository.saveNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(note);
      })
    );

    it(
      'updates the note in the DB when it does exists',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);
        const note = new Note({
          id: uuid(),
          title: 'title',
          body: 'body',
          html: '<p>note</p>',
          userId: uuid(),
        });
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
        const userId = uuid();
        const note1 = new Note({
          id: uuid(),
          title: 'title 1',
          body: 'body',
          html: '<p>note</p>',
          userId,
        });
        const note2 = new Note({
          id: uuid(),
          title: 'title 2',
          body: 'body',
          html: '<p>note</p>',
          userId,
        });
        const note3 = new Note({
          id: uuid(),
          title: 'title 3',
          body: 'body',
          html: '<p>note</p>',
          userId,
        });

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
        const note = new Note({
          id: uuid(),
          title: 'title',
          body: 'body',
          html: '<p>note</p>',
          userId: uuid(),
        });
        await repository.saveNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(note);
      })
    );
  });

  describe('getUserNotesSortedByTitle', () => {
    it(
      'returns a list of all notes filtered by userId and sorted by title',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);

        const userId1 = uuid();
        const userId2 = uuid();

        const note1 = new Note({
          id: uuid(),
          title: 'title 3',
          body: 'body',
          html: '<p>note</p>',
          userId: userId1,
        });
        const note2 = new Note({
          id: uuid(),
          title: 'title 1',
          body: 'body',
          html: '<p>note</p>',
          userId: userId1,
        });
        const note3 = new Note({
          id: uuid(),
          title: 'title 2',
          body: 'body',
          html: '<p>note</p>',
          userId: userId1,
        });
        const note4 = new Note({
          id: uuid(),
          title: 'title 4',
          body: 'body',
          html: '<p>note</p>',
          userId: userId2,
        });

        await repository.saveNote(note1);
        await repository.saveNote(note2);
        await repository.saveNote(note3);
        await repository.saveNote(note4);

        expect(await repository.getUserNotesSortedByTitle(userId1)).toEqual([note2, note3, note1]);
      })
    );
  });

  describe('removeNote', () => {
    it(
      'removes the note',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);

        const note = new Note({
          id: uuid(),
          title: 'title',
          body: 'body',
          html: '<p>note</p>',
          userId: uuid(),
        });
        await repository.saveNote(note);

        await repository.removeNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(null);
      })
    );

    it(
      'does not break if the record does not exist',
      dbTest(async (entityManager) => {
        const repository = new TypeORMNoteRepository(entityManager);
        const note = new Note({
          id: uuid(),
          title: 'title',
          body: 'body',
          html: '<p>note</p>',
          userId: uuid(),
        });

        await repository.removeNote(note);

        expect(await repository.getNoteById(note.id)).toEqual(null);
      })
    );
  });
});
