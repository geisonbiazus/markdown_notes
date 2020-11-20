import { newRemoveNoteState, RemoveNoteInteractor, RemoveNoteState } from './RemoveNoteInteractor';
import { StateManager, uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('newRemoveNoteState', () => {
  it('returns an empty state', () => {
    expect(newRemoveNoteState()).toEqual({ note: undefined, promptConfirmation: false });
  });
});

describe('RemoveNoteInteractor', () => {
  let interactor: RemoveNoteInteractor;
  let client: InMemoryNoteClient;
  let stateManager: StateManager<RemoveNoteState>;
  let state: RemoveNoteState;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    stateManager = new StateManager(newRemoveNoteState());
    interactor = new RemoveNoteInteractor(stateManager, client);
    state = stateManager.getState();
  });

  describe('requestNoteRemoval', () => {
    it('prompts confirmation for the removal of the given note', () => {
      const note = { id: uuid(), title: 'title', body: 'body' };

      interactor.requestNoteRemoval(note);

      const state = stateManager.getState();

      expect(state.note).toEqual(note);
      expect(state.promptConfirmation).toEqual(true);
    });
  });

  describe('cancelNoteRemoval', () => {
    it('closes the prompt for removing the note', () => {
      const note = { id: uuid(), title: 'title', body: 'body' };

      interactor.requestNoteRemoval(note);
      interactor.cancelNoteRemoval();

      const state = stateManager.getState();

      expect(state.note).toEqual(undefined);
      expect(state.promptConfirmation).toEqual(false);
    });
  });

  describe('confirmNoteRemoval', () => {
    it('removes the note in the client', async () => {
      const note = { id: uuid(), title: 'title', body: 'body' };
      await client.saveNote(note);

      interactor.requestNoteRemoval(note);

      await interactor.confirmNoteRemoval();

      const state = stateManager.getState();

      expect(state.note).toEqual(undefined);
      expect(state.promptConfirmation).toEqual(false);
      expect(await client.getNote(note.id)).toEqual(null);
    });

    it('does not do anything when the prompt is closed', async () => {
      const previousState = stateManager.getState();

      await interactor.confirmNoteRemoval();

      expect(stateManager.getState()).toEqual(previousState);
    });
  });
});
