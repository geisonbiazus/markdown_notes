import { NoteClient, Note, SaveNoteResponse } from '../interactors';
import { HTTPClient } from '../../utils';

export class APINoteClient implements NoteClient {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  async saveNote(note: Note): Promise<SaveNoteResponse> {
    const response = await this.httpClient.put<SaveNoteResponse>(`/notes/${note.id}`, {
      title: note.title,
      body: note.body,
    });

    return response.data;
  }
}
