import { initialEditNoteState, saveNote, Note, SaveNoteResponse, SaveNoteClientFn } from './notes';
import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('initialEditNoteState', () => {
  it('returns an empty state', () => {
    expect(initialEditNoteState()).toEqual({ note: {}, errors: {} });
  });
});

describe('saveNote', () => {
  let client: InMemoryNoteClient;

  beforeEach(() => {
    client = new InMemoryNoteClient();
  });

  it('validates required title', async () => {
    let state = await saveNote(initialEditNoteState(), {}, client.saveNote);
    expect(state.errors).toEqual({ title: 'required' });

    state = await saveNote(initialEditNoteState(), { title: '' }, client.saveNote);
    expect(state.errors).toEqual({ title: 'required' });

    state = await saveNote(initialEditNoteState(), { title: ' ' }, client.saveNote);
    expect(state.errors).toEqual({ title: 'required' });
  });

  it('returns the note when valid', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    const { note, errors } = await saveNote(initialEditNoteState(), expectedNote, client.saveNote);

    expect(note).toEqual(expectedNote);
    expect(errors).toEqual({});
  });

  it('cleans up past error when validating again', async () => {
    let state = await saveNote(initialEditNoteState(), {}, client.saveNote);

    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    state = await saveNote(state, expectedNote, client.saveNote);

    expect(state.errors).toEqual({});
  });

  it('saves the note in the client when valid', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };
    const client = new InMemoryNoteClient();

    await saveNote(initialEditNoteState(), expectedNote, client.saveNote);

    expect(await client.getNoteById(id)).toEqual(expectedNote);
  });

  it('returns errors from client when is fails to save', async () => {
    const id = uuid();
    const expectedNote = { id, title: 'title', body: 'body' };

    const saveNoteError: SaveNoteClientFn = async (note) => ({
      status: 'validation_error',
      errors: [{ field: 'title', type: 'required' }],
    });

    const state = await saveNote(initialEditNoteState(), expectedNote, saveNoteError);

    expect(state.errors).toEqual({ title: 'required' });
  });
});
