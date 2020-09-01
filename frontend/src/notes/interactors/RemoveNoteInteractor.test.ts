import { newRemoveNoteState, RemoveNoteInteractor } from './RemoveNoteInteractor';
import { uuid } from '../../utils';

describe('newRemoveNoteState', () => {
  it('returns an empty state', () => {
    expect(newRemoveNoteState()).toEqual({ note: undefined, promptConfirmation: false });
  });
});

describe('RemoveNoteInteractor', () => {
  let interactor: RemoveNoteInteractor;

  beforeEach(() => {
    interactor = new RemoveNoteInteractor();
  });

  describe('requestNoteRemoval', () => {
    it('it prompts confirmation for the removal of the given note', () => {
      const note = { id: uuid(), title: 'title', body: 'body' };
      const state = interactor.requestNoteRemoval(newRemoveNoteState(), note);

      expect(state.note).toEqual(note);
      expect(state.promptConfirmation).toEqual(true);
    });
  });
});
