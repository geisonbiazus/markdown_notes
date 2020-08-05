import { initialEditNoteState, NoteInteractor } from './NoteInteractor';
import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('initialEditNoteState', () => {
  it('returns an empty state', () => {
    expect(initialEditNoteState()).toEqual({ note: {}, errors: {} });
  });
});

describe('saveNote', () => {
  let client: InMemoryNoteClient;
  let noteInteractor: NoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    noteInteractor = new NoteInteractor(client);
  });

  it('validates required title', async () => {
    let state = await noteInteractor.saveNote(initialEditNoteState(), {});
    expect(state.errors).toEqual({ title: 'required' });

    state = await noteInteractor.saveNote(initialEditNoteState(), { title: '' });
    expect(state.errors).toEqual({ title: 'required' });

    state = await noteInteractor.saveNote(initialEditNoteState(), { title: ' ' });
    expect(state.errors).toEqual({ title: 'required' });
  });

  it('returns the note when valid', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    const { note, errors } = await noteInteractor.saveNote(initialEditNoteState(), expectedNote);

    expect(note).toEqual(expectedNote);
    expect(errors).toEqual({});
  });

  it('cleans up past error when validating again', async () => {
    let state = await noteInteractor.saveNote(initialEditNoteState(), {});

    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    state = await noteInteractor.saveNote(state, expectedNote);

    expect(state.errors).toEqual({});
  });

  it('saves the note in the client when valid', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    await noteInteractor.saveNote(initialEditNoteState(), expectedNote);

    expect(await client.getNoteById(id)).toEqual(expectedNote);
  });

  it('does not save the note in the client when invalid', async () => {
    const id = uuid();
    const expectedNote = { id, title: '', body: 'body' };
    const client = new InMemoryNoteClient();

    await noteInteractor.saveNote(initialEditNoteState(), expectedNote);

    expect(await client.getNoteById(id)).toEqual(null);
  });

  it('returns errors from client when is fails to save', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    client.saveNote = async (note) => ({
      status: 'validation_error',
      errors: [{ field: 'title', type: 'required' }],
    });

    const state = await noteInteractor.saveNote(initialEditNoteState(), expectedNote);

    expect(state.errors).toEqual({ title: 'required' });
  });
});
