import { newRemoveNoteState, RemoveNoteInteractor, RemoveNoteState } from './RemoveNoteInteractor';
import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('newRemoveNoteState', () => {
  it('returns an empty state', () => {
    expect(newRemoveNoteState()).toEqual({ note: undefined, promptConfirmation: false });
  });
});

describe('RemoveNoteInteractor', () => {
  let interactor: RemoveNoteInteractor;
  let state: RemoveNoteState;
  let client: InMemoryNoteClient;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    interactor = new RemoveNoteInteractor(client);
    state = newRemoveNoteState();
  });

  describe('requestNoteRemoval', () => {
    it('prompts confirmation for the removal of the given note', () => {
      const note = { id: uuid(), title: 'title', body: 'body' };

      state = interactor.requestNoteRemoval(state, note);

      expect(state.note).toEqual(note);
      expect(state.promptConfirmation).toEqual(true);
    });
  });

  describe('cancelNoteRemoval', () => {
    it('closes the prompt for removing the note', () => {
      const note = { id: uuid(), title: 'title', body: 'body' };

      state = interactor.requestNoteRemoval(state, note);
      state = interactor.cancelNoteRemoval(state);

      expect(state.note).toEqual(undefined);
      expect(state.promptConfirmation).toEqual(false);
    });
  });

  describe('confirmNoteRemoval', () => {
    it('removes the note in the client', async () => {
      const note = { id: uuid(), title: 'title', body: 'body' };

      await client.saveNote(note);

      state = interactor.requestNoteRemoval(state, note);
      state = await interactor.confirmNoteRemoval(state);

      expect(state.note).toEqual(undefined);
      expect(state.promptConfirmation).toEqual(false);
      expect(await client.getNote(note.id)).toEqual(null);
    });

    it('does not do anything when the prompt is closed', async () => {
      expect(await interactor.confirmNoteRemoval(state)).toEqual(state);
    });
  });
});
