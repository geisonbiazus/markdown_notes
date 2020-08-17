import { NoteClient, Note, SaveNoteResponse } from '../interactors';
import { HTTPClient } from '../../utils';

export class APINoteClient implements NoteClient {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  async getNote(id: string): Promise<Note | null> {
    const response = await this.httpClient.get<GetNoteResponse>(`/notes/${id}`);

    if (response.data.status == 'error' && response.data.type == 'not_found') return null;
    if (response.data.status == 'success') return response.data.note as Note;
    throw new Error('Something went wrong');
  }

  async saveNote(note: Note): Promise<SaveNoteResponse> {
    const response = await this.httpClient.put<SaveNoteResponse>(`/notes/${note.id}`, {
      title: note.title,
      body: note.body,
    });

    return response.data;
  }
}

export interface GetNoteResponse {
  status: 'success' | 'error';
  type?: string;
  note?: Note;
}
