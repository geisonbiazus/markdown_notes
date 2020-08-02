import { initialEditNoteState, saveNote } from './notes';

describe('initialEditNoteState', () => {
  it('returns an empty state', () => {
    expect(initialEditNoteState()).toEqual({ note: {}, errors: {} });
  });
});

describe('saveNote', () => {
  it('validates required title', async () => {
    const { errors } = await saveNote(initialEditNoteState(), {});
    expect(errors).toEqual({ title: 'required' });
  });
});
