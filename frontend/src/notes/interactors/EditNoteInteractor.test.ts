import { newEditNoteState, EditNoteInteractor, EditNoteState } from './EditNoteInteractor';
import { StateManager, uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';
import { Note } from '../entities';

describe('newEditNoteState', () => {
  it('returns an empty state', () => {
    expect(newEditNoteState()).toEqual({
      note: { id: '', title: '', body: '' },
      errors: {},
      isDirty: false,
    });
  });
});

describe('EditNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let editNoteInteractor: EditNoteInteractor;
  let stateManager: StateManager<EditNoteState>;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    stateManager = new StateManager(newEditNoteState());
    editNoteInteractor = new EditNoteInteractor(stateManager, client);
  });

  describe('getNote', () => {
    it('sets an empty note with the given ID when note does not exist', async () => {
      const noteId = uuid();

      await editNoteInteractor.getNote(noteId);

      const state = stateManager.getState();
      expect(state.note).toEqual({ id: noteId, title: '', body: '' });
    });

    it('sets the note in the state when it exists in the client', async () => {
      const note: Note = { id: uuid(), title: 'title', body: 'body' };
      client.saveNote(note);

      await editNoteInteractor.getNote(note.id!);

      const state = stateManager.getState();
      expect(state.note).toEqual(note);
    });

    it('sets an empty note when note does not exist and there was a note in the state before', async () => {
      const note: Note = { id: uuid(), title: 'title', body: 'body' };
      client.saveNote(note);
      await editNoteInteractor.getNote(note.id!);

      const noteId = uuid();
      await editNoteInteractor.getNote(noteId);

      const state = stateManager.getState();
      expect(state.note).toEqual({ id: noteId, title: '', body: '' });
    });
  });

  describe('setTitle and setContent', () => {
    it('sets the title and content in the state and sets dirty', async () => {
      const noteId = uuid();
      await editNoteInteractor.getNote(noteId);

      editNoteInteractor.setTitle('new title');
      editNoteInteractor.setBody('new body');

      const state = stateManager.getState();
      expect(state.note).toEqual({ id: noteId, title: 'new title', body: 'new body' });
      expect(state.isDirty).toEqual(true);
    });
  });

  describe('saveNote', () => {
    const id = uuid();

    beforeEach(async () => {
      await editNoteInteractor.getNote(id);
    });

    it('validates required title', async () => {
      editNoteInteractor.setTitle('');
      editNoteInteractor.setBody('body');

      await editNoteInteractor.saveNote();

      const state = stateManager.getState();
      expect(state.errors).toEqual({ title: 'required' });
    });

    it('does not set errors when valid', async () => {
      editNoteInteractor.setTitle('title');
      editNoteInteractor.setBody('body');

      await editNoteInteractor.saveNote();

      const state = stateManager.getState();
      expect(state.errors).toEqual({});
    });

    it('sets isDirty to false when valid', async () => {
      editNoteInteractor.setTitle('title');
      editNoteInteractor.setBody('body');

      await editNoteInteractor.saveNote();

      const state = stateManager.getState();
      expect(state.isDirty).toBeFalsy();
    });

    it('cleans up past errors when validating again', async () => {
      editNoteInteractor.setTitle('');
      editNoteInteractor.setBody('body');
      await editNoteInteractor.saveNote();

      editNoteInteractor.setTitle('title');
      await editNoteInteractor.saveNote();

      const state = stateManager.getState();
      expect(state.errors).toEqual({});
    });

    it('saves the note in the client when valid', async () => {
      const title = 'title';
      const body = 'body';
      editNoteInteractor.setTitle(title);
      editNoteInteractor.setBody(body);

      await editNoteInteractor.saveNote();

      expect(await client.getNote(id)).toEqual({ id, title, body });
    });

    it('does not save the note in the client when invalid', async () => {
      editNoteInteractor.setTitle('');
      editNoteInteractor.setBody('body');

      await editNoteInteractor.saveNote();

      expect(await client.getNote(id)).toEqual(null);
    });

    it('returns errors from client when it fails to save', async () => {
      editNoteInteractor.setTitle('title');
      editNoteInteractor.setBody('body');

      client.saveNote = async (_note) => ({
        status: 'validation_error',
        errors: [{ field: 'title', type: 'required' }],
      });

      await editNoteInteractor.saveNote();

      const state = stateManager.getState();
      expect(state.errors).toEqual({ title: 'required' });
    });
  });
});
