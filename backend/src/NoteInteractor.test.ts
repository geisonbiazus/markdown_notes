import { NoteInteractor, SaveNoteRequest, SaveNoteResponse, Repository } from './NoteInteractor';
import { uuid } from './utils';
import { Note } from './entities';

describe('NoteInteractor', () => {
  let noteInteractor: NoteInteractor;
  let repo: FakeRepository;

  beforeEach(() => {
    repo = new FakeRepository();
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
  });
});

export class FakeRepository implements Repository {
  private notes: Record<string, Note> = {};

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes[id] || null;
  }

  async saveNote(note: Note): Promise<void> {
    this.notes[note.id] = note;
  }
}
