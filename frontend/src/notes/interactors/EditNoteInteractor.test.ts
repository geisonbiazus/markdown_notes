import { FakePublisher, uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';
import { Note } from '../entities';
import { EditNoteInteractor } from './EditNoteInteractor';

describe('EditNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let publisher: FakePublisher;
  let interactor: EditNoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    publisher = new FakePublisher();
    interactor = new EditNoteInteractor(client, publisher);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(interactor.state).toEqual({
        note: { id: '', title: '', body: '' },
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

      await interactor.getNote(noteId);

      expect(interactor.state.note).toEqual({ id: noteId, title: '', body: '' });
    });

    it('sets the note in the state when it exists in the client', async () => {
      const note: Note = { id: uuid(), title: 'title', body: 'body' };
      client.saveNote(note);

      await interactor.getNote(note.id!);

      expect(interactor.state.note).toEqual(note);
    });

    it('sets an empty note when note does not exist and there was a note in the state before', async () => {
      const note: Note = { id: uuid(), title: 'title', body: 'body' };
      client.saveNote(note);
      await interactor.getNote(note.id!);

      const noteId = uuid();
      await interactor.getNote(noteId);

      expect(interactor.state.note).toEqual({ id: noteId, title: '', body: '' });
    });
  });

  describe('setTitle and setContent', () => {
    it('sets the title and content in the state and sets dirty', async () => {
      const noteId = uuid();
      await interactor.getNote(noteId);

      interactor.setTitle('new title');
      interactor.setBody('new body');

      expect(interactor.state.note).toEqual({ id: noteId, title: 'new title', body: 'new body' });
      expect(interactor.state.isDirty).toEqual(true);
    });
  });

  describe('saveNote', () => {
    const id = uuid();

    beforeEach(async () => {
      await interactor.getNote(id);
    });

    it('validates required title', async () => {
      interactor.setTitle('');
      interactor.setBody('body');

      await interactor.saveNote();

      expect(interactor.state.errors).toEqual({ title: 'required' });
    });

    it('does not set errors when valid', async () => {
      interactor.setTitle('title');
      interactor.setBody('body');

      await interactor.saveNote();

      expect(interactor.state.errors).toEqual({});
    });

    it('sets isDirty to false when valid', async () => {
      interactor.setTitle('title');
      interactor.setBody('body');

      await interactor.saveNote();

      expect(interactor.state.isDirty).toBeFalsy();
    });

    it('cleans up past errors when validating again', async () => {
      interactor.setTitle('');
      interactor.setBody('body');
      await interactor.saveNote();

      interactor.setTitle('title');
      await interactor.saveNote();

      expect(interactor.state.errors).toEqual({});
    });

    it('saves the note in the client when valid', async () => {
      const title = 'title';
      const body = 'body';
      interactor.setTitle(title);
      interactor.setBody(body);

      await interactor.saveNote();

      expect(await client.getNote(id)).toEqual({ id, title, body });
    });

    it('does not save the note in the client when invalid', async () => {
      interactor.setTitle('');
      interactor.setBody('body');

      await interactor.saveNote();

      expect(await client.getNote(id)).toEqual(null);
    });

    it('returns errors from client when it fails to save', async () => {
      interactor.setTitle('title');
      interactor.setBody('body');

      client.saveNote = async (_note) => ({
        status: 'validation_error',
        errors: [{ field: 'title', type: 'required' }],
      });

      await interactor.saveNote();

      expect(interactor.state.errors).toEqual({ title: 'required' });
    });

    it('publishes note_saved event', async () => {
      const title = 'title';
      const body = 'body';
      interactor.setTitle(title);
      interactor.setBody(body);

      await interactor.saveNote();

      expect(publisher.events).toEqual([{ name: 'note_saved', payload: interactor.state.note }]);
    });
  });
});
