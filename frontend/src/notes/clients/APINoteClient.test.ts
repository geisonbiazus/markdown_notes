import { APINoteClient } from './APINoteClient';
import { Note } from '../interactors';
import { uuid } from '../../utils';

describe('APINoteClient', () => {
  let client: APINoteClient;

  beforeEach(() => {
    client = new APINoteClient();
    // https://github.com/nock/nock
  });

  describe('saveNote', () => {
    it('requests to save the note throught the api and return success response', async () => {
      const note: Note = { id: uuid(), body: 'body', title: 'title' };

      const response = await client.saveNote(note);

      expect(response).toEqual({
        status: 'success',
        note,
      });
    });

    it('returns api errors when invalid', async () => {
      const note: Note = { id: uuid(), body: 'body', title: '' };

      const response = await client.saveNote(note);

      expect(response).toEqual({
        status: 'validation_error',
        errors: [{ field: 'title', type: 'required' }],
      });
    });
  });
});
