import { newListNoteState, ListNoteInteractor, ListNoteState } from './ListNoteInteractor';
import { StateManager, uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('newListNoteState', () => {
  it('returns an empty state', () => {
    expect(newListNoteState()).toEqual({ notes: [], getNotesPending: false });
  });
});

describe('ListNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let interactor: ListNoteInteractor;
  let stateManager: StateManager<ListNoteState>;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    stateManager = new StateManager(newListNoteState());
    interactor = new ListNoteInteractor(stateManager, client);
  });

  describe('getNotes', () => {
    it('returns empty when there is no note', async () => {
      await interactor.getNotes();
      const state = stateManager.getState();
      expect(state.notes).toEqual([]);
    });

    it('returns the note list when there are some notes', async () => {
      const note1 = { id: uuid(), title: 'Title 1', body: 'body 1' };
      const note2 = { id: uuid(), title: 'Title 2', body: 'body 2' };

      client.saveNote(note1);
      client.saveNote(note2);

      await interactor.getNotes();

      const state = stateManager.getState();
      expect(state.notes).toEqual([note1, note2]);
    });
  });
});
