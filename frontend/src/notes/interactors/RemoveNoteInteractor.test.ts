import { FakePublisher } from '../../utils/pub_sub/FakePublisher';
import { uuid } from '../../utils/uuid';
import { InMemoryNoteClient } from '../adapters/noteClient/InMemoryNoteClient';
import { newNote } from '../entitites/Note';
import { RemoveNoteInteractor } from './RemoveNoteInteractor';

describe('RemoveNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let publisher: FakePublisher;
  let interactor: RemoveNoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    publisher = new FakePublisher();
    interactor = new RemoveNoteInteractor(client, publisher);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(interactor.state).toEqual({
        note: undefined,
        promptConfirmation: false,
        confirmNoteRemovalPending: false,
      });
    });
  });

  describe('requestNoteRemoval', () => {
    it('prompts confirmation for the removal of the given note', () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });

      interactor.requestNoteRemoval(note);

      expect(interactor.state.note).toEqual(note);
      expect(interactor.state.promptConfirmation).toEqual(true);
    });
  });

  describe('cancelNoteRemoval', () => {
    it('closes the prompt for removing the note', () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });

      interactor.requestNoteRemoval(note);
      interactor.cancelNoteRemoval();

      expect(interactor.state.note).toEqual(undefined);
      expect(interactor.state.promptConfirmation).toEqual(false);
    });
  });

  describe('confirmNoteRemoval', () => {
    it('removes the note in the client', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });
      await client.saveNote(note);

      interactor.requestNoteRemoval(note);

      await interactor.confirmNoteRemoval();

      expect(interactor.state.note).toEqual(undefined);
      expect(interactor.state.promptConfirmation).toEqual(false);
      expect(await client.getNote(note.id)).toEqual(null);
    });

    it('publishes note_removed event', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body' });
      await client.saveNote(note);

      interactor.requestNoteRemoval(note);

      await interactor.confirmNoteRemoval();

      expect(publisher.events).toEqual([{ name: 'note_removed', payload: note }]);
    });

    it('does not do anything when the prompt is closed', async () => {
      const previousState = interactor.state;

      await interactor.confirmNoteRemoval();

      expect(interactor.state).toEqual(previousState);
    });
  });
});
