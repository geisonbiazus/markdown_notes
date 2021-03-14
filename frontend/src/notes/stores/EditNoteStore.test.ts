import { FakePublisher } from '../../utils/pub_sub/FakePublisher';
import { uuid } from '../../utils/uuid';
import { InMemoryNoteClient } from '../adapters/noteClient/InMemoryNoteClient';
import { newNote, Note } from '../entitites/Note';
import { NOTE_LOADED_FOR_EDITING_EVENT, NOTE_SAVED_EVENT } from '../events';
import { EditNoteStore } from './EditNoteStore';

describe('EditNoteStore', () => {
  let client: InMemoryNoteClient;
  let publisher: FakePublisher;
  let store: EditNoteStore;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    publisher = new FakePublisher();
    store = new EditNoteStore(client, publisher);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(store.state).toEqual({
        note: newNote(),
        errors: {},
        isDirty: false,
        getNotePending: false,
        saveNotePending: false,
      });
    });
  });

  describe('getNote', () => {
    it('sets an empty note with the given ID when note does not exist', async () => {
      const noteId = uuid();

      await store.getNote(noteId);

      expect(store.state.note).toEqual(newNote({ id: noteId, title: '', body: '' }));
    });

    it('sets the note in the state when it exists in the client', async () => {
      const note: Note = newNote({ id: uuid(), title: 'title', body: 'body' });
      client.saveNote(note);

      await store.getNote(note.id!);

      expect(store.state.note).toEqual(note);
    });

    it('sets an empty note when note does not exist and there was a note in the state before', async () => {
      const note: Note = newNote({ id: uuid(), title: 'title', body: 'body' });
      client.saveNote(note);
      await store.getNote(note.id!);

      const noteId = uuid();
      await store.getNote(noteId);

      expect(store.state.note).toEqual(newNote({ id: noteId, title: '', body: '' }));
    });

    it('publishes NOTE_LOADED_FOR_EDITING_EVENT', async () => {
      const note: Note = newNote({ id: uuid(), title: 'title', body: 'body' });
      client.saveNote(note);

      await store.getNote(note.id!);

      expect(publisher.lastEvent).toEqual({ name: NOTE_LOADED_FOR_EDITING_EVENT, payload: note });
    });

    it('cleans previous state', async () => {
      await store.saveNote();

      const noteId = uuid();
      await store.getNote(noteId);

      expect(store.state.errors).toEqual({});
    });
  });

  describe('setTitle and setContent', () => {
    it('sets the title and content in the state and sets dirty', async () => {
      const noteId = uuid();
      await store.getNote(noteId);

      store.setTitle('new title');
      store.setBody('new body');

      expect(store.state.note).toEqual(
        newNote({ id: noteId, title: 'new title', body: 'new body' })
      );
      expect(store.state.isDirty).toEqual(true);
    });
  });

  describe('saveNote', () => {
    const id = uuid();

    beforeEach(async () => {
      await store.getNote(id);
    });

    it('validates required title', async () => {
      store.setTitle('');
      store.setBody('body');

      const result = await store.saveNote();

      expect(result).toBeFalsy();
      expect(store.state.errors).toEqual({ title: 'required' });
    });

    it('does not set errors when valid', async () => {
      store.setTitle('title');
      store.setBody('body');

      const result = await store.saveNote();

      expect(result).toBeTruthy();
      expect(store.state.errors).toEqual({});
    });

    it('sets isDirty to false when valid', async () => {
      store.setTitle('title');
      store.setBody('body');

      await store.saveNote();

      expect(store.state.isDirty).toBeFalsy();
    });

    it('cleans up past errors when validating again', async () => {
      store.setTitle('');
      store.setBody('body');
      await store.saveNote();

      store.setTitle('title');
      await store.saveNote();

      expect(store.state.errors).toEqual({});
    });

    it('saves the note in the client when valid', async () => {
      const title = 'title';
      const body = 'body';
      store.setTitle(title);
      store.setBody(body);

      await store.saveNote();

      expect(await client.getNote(id)).toEqual(newNote({ id, title, body }));
    });

    it('does not save the note in the client when invalid', async () => {
      store.setTitle('');
      store.setBody('body');

      await store.saveNote();

      expect(await client.getNote(id)).toEqual(null);
    });

    it('returns errors from client when it fails to save', async () => {
      store.setTitle('title');
      store.setBody('body');

      client.saveNote = async (_note) => ({
        status: 'validation_error',
        errors: [{ field: 'title', type: 'required' }],
      });

      await store.saveNote();

      expect(store.state.errors).toEqual({ title: 'required' });
    });

    it('publishes note_saved event', async () => {
      const title = 'title';
      const body = 'body';
      store.setTitle(title);
      store.setBody(body);

      await store.saveNote();

      expect(publisher.lastEvent).toEqual({
        name: NOTE_SAVED_EVENT,
        payload: store.state.note,
      });
    });
  });
});
