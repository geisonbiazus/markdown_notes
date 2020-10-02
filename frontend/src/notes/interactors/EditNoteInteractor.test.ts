import { newEditNoteState, EditNoteInteractor } from './EditNoteInteractor';
import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';
import { Note } from './entities';

describe('newEditNoteState', () => {
  it('returns an empty state', () => {
    expect(newEditNoteState()).toEqual({
      note: { id: '', title: '', body: '' },
      errors: {},
      isDirty: false,
    });
  });
});

describe('EditNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let editNoteInteractor: EditNoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    editNoteInteractor = new EditNoteInteractor(client);
  });

  describe('getNote', () => {
    it('sets an empty note with the given ID when note does not exist', async () => {
      const noteId = uuid();
      const state = await editNoteInteractor.getNote(newEditNoteState(), noteId);
      expect(state.note).toEqual({ id: noteId, title: '', body: '' });
    });

    it('sets an empty note when note does not exist and there was a note in the state before', async () => {
      const noteId = uuid();
      let state = newEditNoteState({ note: { id: uuid(), title: 'title', body: 'body' } });
      state = await editNoteInteractor.getNote(state, noteId);
      expect(state.note).toEqual({ id: noteId, title: '', body: '' });
    });

    it('sets the note in the state when it exists in the client', async () => {
      const note: Note = { id: uuid(), title: 'title', body: 'body' };
      client.saveNote(note);

      const state = await editNoteInteractor.getNote(newEditNoteState(), note.id!);
      expect(state.note).toEqual(note);
    });
  });

  describe('setTitle', () => {
    it('sets the title in the state', () => {
      const noteId = uuid();

      let state = newEditNoteState({
        note: { id: noteId, title: 'not changed', body: 'not changed' },
      });

      state = editNoteInteractor.setTitle(state, 'changed');

      expect(state.note).toEqual({ id: noteId, title: 'changed', body: 'not changed' });
    });

    it('sets isDirty to true', () => {
      const state = editNoteInteractor.setTitle(newEditNoteState({ isDirty: false }), 'title');
      expect(state.isDirty).toEqual(true);
    });
  });

  describe('setBody', () => {
    it('sets the body in the state', () => {
      const noteId = uuid();

      let state = newEditNoteState({
        note: { id: noteId, title: 'not changed', body: 'not changed' },
      });

      state = editNoteInteractor.setBody(state, 'changed');

      expect(state.note).toEqual({ id: noteId, title: 'not changed', body: 'changed' });
    });

    it('sets isDirty to true', () => {
      const state = editNoteInteractor.setBody(newEditNoteState({ isDirty: false }), 'body');
      expect(state.isDirty).toEqual(true);
    });
  });

  describe('saveNote', () => {
    it('validates required title', async () => {
      const id = uuid();
      const body = 'body';
      let state = await editNoteInteractor.saveNote(newEditNoteState());
      expect(state.errors).toEqual({ title: 'required' });

      const note = { id, title: '', body };
      state = await editNoteInteractor.saveNote(newEditNoteState({ note }));
      expect(state.errors).toEqual({ title: 'required' });
    });

    it('returns the note when valid', async () => {
      const id = uuid();
      const expectedNote = { id, title: 'title', body: 'body' };

      const { note, errors } = await editNoteInteractor.saveNote(
        newEditNoteState({ note: expectedNote })
      );

      expect(note).toEqual(expectedNote);
      expect(errors).toEqual({});
    });

    it('sets isDirty to false when valid', async () => {
      const id = uuid();
      const note = { id, title: 'title', body: 'body' };

      const { isDirty } = await editNoteInteractor.saveNote(
        newEditNoteState({ note: note, isDirty: true })
      );

      expect(isDirty).toEqual(false);
    });

    it('cleans up past error when validating again', async () => {
      let state = await editNoteInteractor.saveNote(newEditNoteState());

      const id = uuid();
      const expectedNote = { id, title: 'title', body: 'body' };

      state = await editNoteInteractor.saveNote({ ...state, note: expectedNote });

      expect(state.errors).toEqual({});
    });

    it('saves the note in the client when valid', async () => {
      const id = uuid();
      const note = { id, title: 'title', body: 'body' };

      await editNoteInteractor.saveNote(newEditNoteState({ note }));

      expect(await client.getNote(id)).toEqual(note);
    });

    it('does not save the note in the client when invalid', async () => {
      const id = uuid();
      const note = { id, title: '', body: 'body' };
      const client = new InMemoryNoteClient();

      await editNoteInteractor.saveNote(newEditNoteState({ note }));

      expect(await client.getNote(id)).toEqual(null);
    });

    it('returns errors from client when is fails to save', async () => {
      const id = uuid();
      const note = { id, title: 'title', body: 'body' };

      client.saveNote = async (_note) => ({
        status: 'validation_error',
        errors: [{ field: 'title', type: 'required' }],
      });

      const state = await editNoteInteractor.saveNote(newEditNoteState({ note }));

      expect(state.errors).toEqual({ title: 'required' });
    });
  });
});
