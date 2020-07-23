import {
  NoteInteractor,
  CreateNoteRequest,
  CreateNoteResponse,
  Repository,
} from './NoteInteractor';
import { uuid } from './utils';
import { Note } from './entities';

describe('NoteInteractor', () => {
  let noteInteractor: NoteInteractor;
  let repo: Repository;

  beforeEach(() => {
    repo = new FakeRepository();
    noteInteractor = new NoteInteractor(repo);
  });

  describe('createNote', () => {
    it('validates required id', async () => {
      const params = new CreateNoteRequest({ id: '', title: 'Title', body: 'Body' });
      const response = CreateNoteResponse.error([{ field: 'id', type: 'required' }]);

      expect(await noteInteractor.createNote(params)).toEqual(response);
    });

    it('validates required title', async () => {
      const params = new CreateNoteRequest({ id: uuid(), title: '', body: 'Body' });
      const response = CreateNoteResponse.error([{ field: 'title', type: 'required' }]);

      expect(await noteInteractor.createNote(params)).toEqual(response);
    });

    it('returns all invalid fields', async () => {
      const params = new CreateNoteRequest({ id: '', title: '', body: 'Body' });
      const response = CreateNoteResponse.error([
        { field: 'id', type: 'required' },
        { field: 'title', type: 'required' },
      ]);

      expect(await noteInteractor.createNote(params)).toEqual(response);
    });

    it('creates a new note', async () => {
      const noteId = uuid();
      const params = new CreateNoteRequest({ id: noteId, title: 'Title', body: 'body' });
      const response = CreateNoteResponse.success(
        new Note({ id: noteId, title: 'Title', body: 'body' })
      );

      expect(await noteInteractor.createNote(params)).toEqual(response);
    });

    it('persists the created note', async () => {
      const noteId = uuid();
      const expectedNote = new Note({ id: noteId, title: 'Title', body: 'body' });
      const request = new CreateNoteRequest({ id: noteId, title: 'Title', body: 'body' });

      await noteInteractor.createNote(request);

      expect(await repo.getNoteById(noteId)).toEqual(expectedNote);
    });
  });
});

export class FakeRepository implements Repository {
  private notes: Record<string, Note> = {};

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes[id] || null;
  }

  async createNote(note: Note): Promise<void> {
    this.notes[note.id] = note;
  }
}
