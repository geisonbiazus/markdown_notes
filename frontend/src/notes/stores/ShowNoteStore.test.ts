import { FakePublisher } from '../../utils/pub_sub/FakePublisher';
import { uuid } from '../../utils/uuid';
import { InMemoryNoteClient } from '../adapters/noteClient/InMemoryNoteClient';
import { newNote } from '../entitites/Note';
import { NOTE_LOADED_FOR_SHOWING_EVENT } from '../events';
import { ShowNoteStore } from './ShowNoteStore';

describe('ShowNoteStore', () => {
  let client: InMemoryNoteClient;
  let publisher: FakePublisher;
  let store: ShowNoteStore;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    publisher = new FakePublisher();
    store = new ShowNoteStore(client, publisher);
  });

  describe('constructor', () => {
    it('initlializes with en empty state', () => {
      expect(store.state).toEqual({
        getNotePending: false,
        isFound: true,
      });
    });
  });

  describe('getNote', () => {
    it('sets notFound to true when note does not exist', async () => {
      await store.getNote(uuid());
      expect(store.state.isFound).toBeFalsy();
    });

    it('sets the note when note is found', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      await client.saveNote(note);

      await store.getNote(note.id);

      expect(store.state.note).toEqual(note);
      expect(store.state.isFound).toBeTruthy();
    });

    it('sets is found to true when it was not found before', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      await client.saveNote(note);

      await store.getNote(uuid());
      await store.getNote(note.id);

      expect(store.state.note).toEqual(note);
      expect(store.state.isFound).toBeTruthy();
    });

    it('sets note to undefined when not was found before', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      await client.saveNote(note);

      await store.getNote(note.id);
      await store.getNote(uuid());

      expect(store.state.note).toBeUndefined();
      expect(store.state.isFound).toBeFalsy();
    });

    it('publishes NOTE_LOADED_FOR_SHOWING_EVENT', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      client.saveNote(note);

      await store.getNote(note.id!);

      expect(publisher.lastEvent).toEqual({ name: NOTE_LOADED_FOR_SHOWING_EVENT, payload: note });
    });
  });
});
