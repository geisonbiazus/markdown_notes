import { newListNoteState, ListNoteInteractor } from './ListNoteInteractor';
import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';

describe('newListNoteState', () => {
  it('returns an empty state', () => {
    expect(newListNoteState()).toEqual({ notes: [] });
  });
});

describe('ListNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let interactor: ListNoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    interactor = new ListNoteInteractor(client);
  });

  describe('getNotes', () => {
    it('returns empty when there is no note', async () => {
      const state = await interactor.getNotes(newListNoteState());
      expect(state.notes).toEqual([]);
    });

    it('returns the note list when there are some notes', async () => {
      const note1 = { id: uuid(), title: 'Title 1', body: 'body 1' };
      const note2 = { id: uuid(), title: 'Title 2', body: 'body 2' };

      client.saveNote(note1);
      client.saveNote(note2);

      const state = await interactor.getNotes(newListNoteState());
      expect(state.notes).toEqual([note1, note2]);
    });
  });
});
