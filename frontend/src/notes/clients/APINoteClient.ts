import { NoteClient, Note, SaveNoteResponse } from '../interactors';
import { HTTPClient, HTTPResponse } from '../../utils';

export class APINoteClient implements NoteClient {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  async getNote(id: string): Promise<Note | null> {
    const response = await this.httpClient.get<GetNoteResponse>(`/notes/${id}`);

    if (response.status === 200 && response.data.status === 'success') {
      return response.data.note as Note;
    }

    if (response.data.status === 'error' && response.data.type === 'not_found') return null;

    throw this.handleError(response);
  }

  async getNotes(): Promise<Note[]> {
    const response = await this.httpClient.get<GetNotesResponse>('/notes');

    if (response.status === 200 && response.data.status === 'success') return response.data.notes;
    throw this.handleError(response);
  }

  async saveNote(note: Note): Promise<SaveNoteResponse> {
    const response = await this.httpClient.put<SaveNoteResponse>(`/notes/${note.id}`, {
      title: note.title,
      body: note.body,
    });

    return response.data;
  }

  async removeNote(id: string): Promise<void> {
    const response = await this.httpClient.delete<RemoveNoteResponse>(`/notes/${id}`);
    if (response.status === 200 && response.data.status === 'success') return;
    throw this.handleError(response);
  }

  private handleError<T>(response: HTTPResponse<T>) {
    throw new Error(
      `Something went wrong. Status: ${response.status}. Body: ${JSON.stringify(response.data)}`
    );
  }
}

export interface GetNoteResponse {
  status: 'success' | 'error';
  type?: string;
  note?: Note;
}

export interface GetNotesResponse {
  status: 'success';
  notes: Note[];
}

interface RemoveNoteResponse {
  status: string;
  type?: string;
}
