import { NoteInteractor, SaveNoteRequest, SaveNoteResponse, Repository } from './NoteInteractor';
import { uuid } from './utils';
import { Note } from './entities';
import { InMemoryRepository } from './InMemoryRepository';

describe('NoteInteractor', () => {
  let noteInteractor: NoteInteractor;
  let repo: InMemoryRepository;

  beforeEach(() => {
    repo = new InMemoryRepository();
    noteInteractor = new NoteInteractor(repo);
  });

  describe('saveNote', () => {
    it('validates required id', async () => {
      const params = new SaveNoteRequest({ id: '', title: 'Title', body: 'Body' });
      const response = SaveNoteResponse.error([{ field: 'id', type: 'required' }]);

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('validates required title', async () => {
      const params = new SaveNoteRequest({ id: uuid(), title: '', body: 'Body' });
      const response = SaveNoteResponse.error([{ field: 'title', type: 'required' }]);

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('returns all invalid fields', async () => {
      const params = new SaveNoteRequest({ id: '', title: '', body: 'Body' });
      const response = SaveNoteResponse.error([
        { field: 'id', type: 'required' },
        { field: 'title', type: 'required' },
      ]);

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('creates a new note', async () => {
      const noteId = uuid();
      const params = new SaveNoteRequest({ id: noteId, title: 'Title', body: 'body' });
      const response = SaveNoteResponse.success(
        new Note({ id: noteId, title: 'Title', body: 'body' })
      );

      expect(await noteInteractor.saveNote(params)).toEqual(response);
    });

    it('persists the created note', async () => {
      const noteId = uuid();
      const expectedNote = new Note({ id: noteId, title: 'Title', body: 'body' });
      const request = new SaveNoteRequest({ id: noteId, title: 'Title', body: 'body' });

      await noteInteractor.saveNote(request);

      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });

    it('updates the note when it already exists', async () => {
      const noteId = uuid();
      const expectedNote = new Note({ id: noteId, title: 'Title 2', body: 'Body 2' });
      const request1 = new SaveNoteRequest({ id: noteId, title: 'Title 1', body: 'Body 1' });
      const request2 = new SaveNoteRequest({ id: noteId, title: 'Title 2', body: 'Body 2' });

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
      const request1 = new SaveNoteRequest({ id: noteId1, title: 'Title', body: 'Body' });
      const request2 = new SaveNoteRequest({ id: noteId2, title: 'Title', body: 'Body' });

      await noteInteractor.saveNote(request1);
      await noteInteractor.saveNote(request2);

      expect(await repo.getNoteById(noteId1)).toEqual(expectedNote1);
      expect(await repo.getNoteById(noteId2)).toEqual(expectedNote2);
    });
  });
});
