import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';
import { ListNoteInteractor } from './ListNoteInteractor';

describe('ListNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let interactor: ListNoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    interactor = new ListNoteInteractor(client);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(interactor.state).toEqual({ notes: [], getNotesPending: false });
    });
  });

  describe('getNotes', () => {
    it('returns empty when there is no note', async () => {
      await interactor.getNotes();
      expect(interactor.state.notes).toEqual([]);
    });

    it('returns the note list when there are some notes', async () => {
      const note1 = { id: uuid(), title: 'Title 1', body: 'body 1' };
      const note2 = { id: uuid(), title: 'Title 2', body: 'body 2' };

      client.saveNote(note1);
      client.saveNote(note2);

      await interactor.getNotes();

      expect(interactor.state.notes).toEqual([note1, note2]);
    });
  });
});
