import { NoteInteractor, SaveNoteRequest, SaveNoteResponse } from './NoteInteractor';
import { uuid } from '../../utils';
import { Note } from '../entities';
import { InMemoryRepository } from '../repositories';
import { InteractorResponse } from './InteractorResponse';
import { response } from 'express';

describe('NoteInteractor', () => {
  let noteInteractor: NoteInteractor;
  let repo: InMemoryRepository;

  beforeEach(() => {
    repo = new InMemoryRepository();
    noteInteractor = new NoteInteractor(repo);
  });

  describe('saveNote', () => {
    it('validates required id', async () => {
      const params = { id: '', title: 'Title', body: 'Body' };
      const response = SaveNoteResponse.error([{ field: 'id', type: 'required' }]);

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('validates required title', async () => {
      const params = { id: uuid(), title: '', body: 'Body' };
      const response = SaveNoteResponse.error([{ field: 'title', type: 'required' }]);

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('returns all invalid fields', async () => {
      const params = { id: '', title: '', body: 'Body' };
      const response = SaveNoteResponse.error([
        { field: 'id', type: 'required' },
        { field: 'title', type: 'required' },
      ]);

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('creates a new note', async () => {
      const noteId = uuid();
      const params = { id: noteId, title: 'Title', body: 'body' };
      const response = SaveNoteResponse.success(
        new Note({ id: noteId, title: 'Title', body: 'body' })
      );

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('persists the created note', async () => {
      const noteId = uuid();
      const expectedNote = new Note({ id: noteId, title: 'Title', body: 'body' });
      const request = { id: noteId, title: 'Title', body: 'body' };

      await noteInteractor.saveNote(request);

      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });

    it('updates the note when it already exists', async () => {
      const noteId = uuid();
      const expectedNote = new Note({ id: noteId, title: 'Title 2', body: 'Body 2' });
      const request1 = { id: noteId, title: 'Title 1', body: 'Body 1' };
      const request2 = { id: noteId, title: 'Title 2', body: 'Body 2' };

      await noteInteractor.saveNote(request1);

      expect(await noteInteractor.saveNote(request2)).toEqual(
        SaveNoteResponse.success(expectedNote)
      );
      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });

    it('stores different ids independently', async () => {
      const noteId1 = uuid();
      const noteId2 = uuid();
      const expectedNote1 = new Note({ id: noteId1, title: 'Title', body: 'Body' });
      const expectedNote2 = new Note({ id: noteId2, title: 'Title', body: 'Body' });
      const request1 = { id: noteId1, title: 'Title', body: 'Body' };
      const request2 = { id: noteId2, title: 'Title', body: 'Body' };

      await noteInteractor.saveNote(request1);
      await noteInteractor.saveNote(request2);

      expect(await repo.getNoteById(noteId1)).toEqual(expectedNote1);
      expect(await repo.getNoteById(noteId2)).toEqual(expectedNote2);
    });
  });

  describe('getNote', () => {
    it('returns note not found when note does not exist', async () => {
      const response = { status: 'error', type: 'not_found' };

      expect(await noteInteractor.getNote(uuid())).toEqual(response);
    });

    it('returns note not found when note does not exist', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });
      const response = { status: 'success', data: note };

      repo.saveNote(note);

      expect(await noteInteractor.getNote(note.id)).toEqual(response);
    });
  });

  describe('getNotes', () => {
    it('returns an empty list when there is no note', async () => {
      const response = { status: 'success', data: [] };
      expect(await noteInteractor.getNotes()).toEqual(response);
    });

    it('returns a note when it is saved', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });

      repo.saveNote(note);

      const response = { status: 'success', data: [note] };
      expect(await noteInteractor.getNotes()).toEqual(response);
    });

    it('returns a list of notes sorted alphabetically', async () => {
      const note1 = new Note({ id: uuid(), title: 'Note B', body: 'body' });
      const note2 = new Note({ id: uuid(), title: 'Note C', body: 'body' });
      const note3 = new Note({ id: uuid(), title: 'Note A', body: 'body' });

      repo.saveNote(note1);
      repo.saveNote(note2);
      repo.saveNote(note3);

      const response = { status: 'success', data: [note3, note1, note2] };
      expect(await noteInteractor.getNotes()).toEqual(response);
    });
  });

  describe('removeNote', () => {
    it('returns not found error when note does not exit', async () => {
      const response = { status: 'error', type: 'not_found' };

      expect(await noteInteractor.removeNote(uuid())).toEqual(response);
    });

    it('removes the note when it exists', async () => {
      const note = new Note({ id: uuid(), title: 'title', body: 'body' });
      repo.saveNote(note);

      const response = { status: 'success' };

      expect(await noteInteractor.removeNote(note.id)).toEqual(response);
      expect(await repo.getNoteById(note.id)).toEqual(null);
    });
  });
});
