import { FakePublisher } from '../../utils/pub_sub/FakePublisher';
import { uuid } from '../../utils/uuid';
import { InMemoryNoteClient } from '../clients/InMemoryNoteClient';
import { newNote } from '../entities';
import { NOTE_LOADED_FOR_SHOWING_EVENT } from '../events';
import { ShowNoteInteractor } from './ShowNoteInteractor';

describe('ShowNoteInteractor', () => {
  let client: InMemoryNoteClient;
  let publisher: FakePublisher;
  let interactor: ShowNoteInteractor;

  beforeEach(() => {
    client = new InMemoryNoteClient();
    publisher = new FakePublisher();
    interactor = new ShowNoteInteractor(client, publisher);
  });

  describe('constructor', () => {
    it('initlializes with en empty state', () => {
      expect(interactor.state).toEqual({
        getNotePending: false,
        isFound: true,
      });
    });
  });

  describe('getNote', () => {
    it('sets notFound to true when note does not exist', async () => {
      await interactor.getNote(uuid());
      expect(interactor.state.isFound).toBeFalsy();
    });

    it('sets the note when note is found', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      await client.saveNote(note);

      await interactor.getNote(note.id);

      expect(interactor.state.note).toEqual(note);
      expect(interactor.state.isFound).toBeTruthy();
    });

    it('sets is found to true when it was not found before', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      await client.saveNote(note);

      await interactor.getNote(uuid());
      await interactor.getNote(note.id);

      expect(interactor.state.note).toEqual(note);
      expect(interactor.state.isFound).toBeTruthy();
    });

    it('sets note to undefined when not was found before', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      await client.saveNote(note);

      await interactor.getNote(note.id);
      await interactor.getNote(uuid());

      expect(interactor.state.note).toBeUndefined();
      expect(interactor.state.isFound).toBeFalsy();
    });

    it('publishes NOTE_LOADED_FOR_SHOWING_EVENT', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      client.saveNote(note);

      await interactor.getNote(note.id!);

      expect(publisher.lastEvent).toEqual({ name: NOTE_LOADED_FOR_SHOWING_EVENT, payload: note });
    });
  });
});
