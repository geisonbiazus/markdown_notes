import { newEditNoteState, NoteInteractor, Note } from './NoteInteractor';
import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('newEditNoteState', () => {
  it('returns an empty state', () => {
    expect(newEditNoteState()).toEqual({ note: { id: '', title: '', body: '' }, errors: {} });
  });
});

describe(NoteInteractor, () => {
  let client: InMemoryNoteClient;
  let noteInteractor: NoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    noteInteractor = new NoteInteractor(client);
  });

  describe('getNote', () => {
    it('sets an empty note with the given id when note does not exist', async () => {
      const noteId = uuid();
      const state = await noteInteractor.getNote(newEditNoteState(), noteId);
      expect(state.note).toEqual({ id: noteId, title: '', body: '' });
    });

    it('sets an empty note when note does not exist and there was a note in the state before', async () => {
      const noteId = uuid();
      let state = newEditNoteState({ note: { id: uuid(), title: 'title', body: 'body' } });
      state = await noteInteractor.getNote(state, noteId);
      expect(state.note).toEqual({ id: noteId, title: '', body: '' });
    });

    it('sets the note in the state when it exists in the client', async () => {
      const note: Note = { id: uuid(), title: 'title', body: 'body' };
      client.saveNote(note);

      const state = await noteInteractor.getNote(newEditNoteState(), note.id!);
      expect(state.note).toEqual(note);
    });
  });

  describe('setTitle', () => {
    it('sets the title in the state', () => {
      const noteId = uuid();

      let state = newEditNoteState({
        note: { id: noteId, title: 'not changed', body: 'not changed' },
      });

      state = noteInteractor.setTitle(state, 'changed');

      expect(state.note).toEqual({ id: noteId, title: 'changed', body: 'not changed' });
    });
  });

  describe('setBody', () => {
    it('sets the body in the state', () => {
      const noteId = uuid();

      let state = newEditNoteState({
        note: { id: noteId, title: 'not changed', body: 'not changed' },
      });

      state = noteInteractor.setBody(state, 'changed');

      expect(state.note).toEqual({ id: noteId, title: 'not changed', body: 'changed' });
    });
  });

  describe('saveNote', () => {
    it('validates required title', async () => {
      const id = uuid();
      const body = 'body';
      let state = await noteInteractor.saveNote(newEditNoteState());
      expect(state.errors).toEqual({ title: 'required' });

      const note = { id, title: '', body };
      state = await noteInteractor.saveNote(newEditNoteState({ note }));
      expect(state.errors).toEqual({ title: 'required' });
    });

    it('returns the note when valid', async () => {
      const id = uuid();
      const expectedNote = { id, title: 'title', body: 'body' };

      const { note, errors } = await noteInteractor.saveNote(
        newEditNoteState({ note: expectedNote })
      );

      expect(note).toEqual(expectedNote);
      expect(errors).toEqual({});
    });

    it('cleans up past error when validating again', async () => {
      let state = await noteInteractor.saveNote(newEditNoteState());

      const id = uuid();
      const expectedNote = { id, title: 'title', body: 'body' };

      state = await noteInteractor.saveNote({ ...state, note: expectedNote });

      expect(state.errors).toEqual({});
    });

    it('saves the note in the client when valid', async () => {
      const id = uuid();
      const note = { id, title: 'title', body: 'body' };

      await noteInteractor.saveNote(newEditNoteState({ note }));

      expect(await client.getNote(id)).toEqual(note);
    });

    it('does not save the note in the client when invalid', async () => {
      const id = uuid();
      const note = { id, title: '', body: 'body' };
      const client = new InMemoryNoteClient();

      await noteInteractor.saveNote(newEditNoteState({ note }));

      expect(await client.getNote(id)).toEqual(null);
    });

    it('returns errors from client when is fails to save', async () => {
      const id = uuid();
      const note = { id, title: 'title', body: 'body' };

      client.saveNote = async (_note) => ({
        status: 'validation_error',
        errors: [{ field: 'title', type: 'required' }],
      });

      const state = await noteInteractor.saveNote(newEditNoteState({ note }));

      expect(state.errors).toEqual({ title: 'required' });
    });
  });
});
