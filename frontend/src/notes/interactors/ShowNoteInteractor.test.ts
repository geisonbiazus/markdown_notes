import { uuid } from '../../utils';
import { InMemoryNoteClient } from '../clients';
import { newNote } from '../entities';
import { ShowNoteInteractor } from './ShowNoteInteractor';

describe('ShowNoteInteractor', () => {
  let noteClient: InMemoryNoteClient;
  let interactor: ShowNoteInteractor;

  beforeEach(() => {
    noteClient = new InMemoryNoteClient();
    interactor = new ShowNoteInteractor(noteClient);
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
      await noteClient.saveNote(note);

      await interactor.getNote(note.id);

      expect(interactor.state.note).toEqual(note);
      expect(interactor.state.isFound).toBeTruthy();
    });

    it('sets is found to true when it was not found before', async () => {
      const note = newNote({ id: uuid(), title: 'title', body: 'body', html: '<p>html</p>' });
      await noteClient.saveNote(note);

      await interactor.getNote(uuid());
      await interactor.getNote(note.id);

      expect(interactor.state.note).toEqual(note);
      expect(interactor.state.isFound).toBeTruthy();
    });
  });
});
