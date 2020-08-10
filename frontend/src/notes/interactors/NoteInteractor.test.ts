import { newEditNoteState, NoteInteractor } from './NoteInteractor';
import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('newEditNoteState', () => {
  it('returns an empty state', () => {
    expect(newEditNoteState()).toEqual({ note: {}, errors: {} });
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
    let state = await noteInteractor.saveNote(newEditNoteState(), {});
    expect(state.errors).toEqual({ title: 'required' });

    state = await noteInteractor.saveNote(newEditNoteState(), { title: '' });
    expect(state.errors).toEqual({ title: 'required' });

    state = await noteInteractor.saveNote(newEditNoteState(), { title: ' ' });
    expect(state.errors).toEqual({ title: 'required' });
  });

  it('returns the note when valid', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    const { note, errors } = await noteInteractor.saveNote(newEditNoteState(), expectedNote);

    expect(note).toEqual(expectedNote);
    expect(errors).toEqual({});
  });

  it('cleans up past error when validating again', async () => {
    let state = await noteInteractor.saveNote(newEditNoteState(), {});

    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    state = await noteInteractor.saveNote(state, expectedNote);

    expect(state.errors).toEqual({});
  });

  it('saves the note in the client when valid', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    await noteInteractor.saveNote(newEditNoteState(), expectedNote);

    expect(await client.getNoteById(id)).toEqual(expectedNote);
  });

  it('does not save the note in the client when invalid', async () => {
    const id = uuid();
    const expectedNote = { id, title: '', body: 'body' };
    const client = new InMemoryNoteClient();

    await noteInteractor.saveNote(newEditNoteState(), expectedNote);

    expect(await client.getNoteById(id)).toEqual(null);
  });

  it('returns errors from client when is fails to save', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    client.saveNote = async (_note) => ({
      status: 'validation_error',
      errors: [{ field: 'title', type: 'required' }],
    });

    const state = await noteInteractor.saveNote(newEditNoteState(), expectedNote);

    expect(state.errors).toEqual({ title: 'required' });
  });
});
