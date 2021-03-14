import { FakePublisher } from '../../shared/adapters/pubSub/FakePublisher';
import { uuid } from '../../shared/utils/uuid';
import { InMemoryNoteClient } from '../adapters/noteClient/InMemoryNoteClient';
import { newNote } from '../entitites/Note';
import { RemoveNoteStore } from './RemoveNoteStore';

describe('RemoveNoteStore', () => {
  let client: InMemoryNoteClient;
  let publisher: FakePublisher;
  let store: RemoveNoteStore;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    publisher = new FakePublisher();
    store = new RemoveNoteStore(client, publisher);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(store.state).toEqual({
        note: undefined,
        promptConfirmation: false,
        confirmNoteRemovalPending: false,
      });
    });
  });

  describe('requestNoteRemoval', () => {
    it('prompts confirmation for the removal of the given note', () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });

      store.requestNoteRemoval(note);

      expect(store.state.note).toEqual(note);
      expect(store.state.promptConfirmation).toEqual(true);
    });
  });

  describe('cancelNoteRemoval', () => {
    it('closes the prompt for removing the note', () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });

      store.requestNoteRemoval(note);
      store.cancelNoteRemoval();

      expect(store.state.note).toEqual(undefined);
      expect(store.state.promptConfirmation).toEqual(false);
    });
  });

  describe('confirmNoteRemoval', () => {
    it('removes the note in the client', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });
      await client.saveNote(note);

      store.requestNoteRemoval(note);

      await store.confirmNoteRemoval();

      expect(store.state.note).toEqual(undefined);
      expect(store.state.promptConfirmation).toEqual(false);
      expect(await client.getNote(note.id)).toEqual(null);
    });

    it('publishes note_removed event', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });
      await client.saveNote(note);

      store.requestNoteRemoval(note);

      await store.confirmNoteRemoval();

      expect(publisher.events).toEqual([{ name: 'note_removed', payload: note }]);
    });

    it('does not do anything when the prompt is closed', async () => {
      const previousState = store.state;

      await store.confirmNoteRemoval();

      expect(store.state).toEqual(previousState);
    });
  });
});
