import { init } from './notes';

describe('getState', () => {
  it('starts with an empty state', () => {
    const { getState } = init();

    expect(getState()).toEqual({ note: {}, errors: {} });
  });
});

describe('saveNote', () => {
  it('validates required title', async () => {
    const { getState, saveNote } = init();

    await saveNote({});

    const { errors } = getState();
    expect(errors).toEqual({ title: 'required' });
  });
});
