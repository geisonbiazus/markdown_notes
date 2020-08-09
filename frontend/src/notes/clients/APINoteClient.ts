import { NoteClient, Note, SaveNoteResponse } from '../interactors';
import { HTTPClient } from '../../utils';

export class APINoteClient implements NoteClient {
  private httpClient: HTTPClient;

  constructor() {
    this.httpClient = new HTTPClient('http://localhost:4000');
  }

  async saveNote(note: Note): Promise<SaveNoteResponse> {
    const response = await this.httpClient.put<SaveNoteResponse>(`/notes/${note.id}`, {
      title: note.title,
      body: note.body,
    });

    return response.data;
  }
}
