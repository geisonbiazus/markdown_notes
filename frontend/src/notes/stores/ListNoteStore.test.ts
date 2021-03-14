import { uuid } from '../../utils/uuid';
import { InMemoryNoteClient } from '../adapters/noteClient/InMemoryNoteClient';
import { newNote } from '../entitites/Note';
import { ListNoteStore } from './ListNoteStore';

describe('ListNoteStore', () => {
  let client: InMemoryNoteClient;
  let store: ListNoteStore;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    store = new ListNoteStore(client);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(store.state).toEqual({
        notes: [],
        getNotesPending: false,
      });
    });
  });

  describe('getNotes', () => {
    it('returns empty when there is no note', async () => {
      await store.getNotes();
      expect(store.state.notes).toEqual([]);
    });

    it('returns the note list when there are some notes', async () => {
      const note1 = newNote({ id: uuid(), title: 'Title 1', body: 'body 1' });
      const note2 = newNote({ id: uuid(), title: 'Title 2', body: 'body 2' });

      client.saveNote(note1);
      client.saveNote(note2);

      await store.getNotes();

      expect(store.state.notes).toEqual([note1, note2]);
    });
  });

  describe('setActiveNoteId', () => {
    it('sets the active note ID', () => {
      const noteId = uuid();
      store.setActiveNoteId(noteId);

      expect(store.state.activeNoteId).toEqual(noteId);
    });
  });
});
