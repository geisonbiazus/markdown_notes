import { handleError, HTTPClient } from '../../../shared/adapters/httpClient/HTTPClient';
import { NoteClient, SaveNoteResponse } from '../../ports/NoteClient';
import { Note } from '../../entitites/Note';

export class APINoteClient implements NoteClient {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  public async getNote(id: string): Promise<Note | null> {
    const response = await this.httpClient.get<Note | APIError>(`/notes/${id}`);

    if (response.status === 200) return response.data as Note;
    if (response.status === 404) return null;
    if (response.status === 401) return null;

    throw handleError(response);
  }

  public async getNotes(): Promise<Note[]> {
    const response = await this.httpClient.get<Note[] | APIError>('/notes');

    if (response.status === 200) return response.data as Note[];
    if (response.status === 401) return [];

    throw handleError(response);
  }

  public async saveNote(note: Note): Promise<SaveNoteResponse> {
    const response = await this.httpClient.put<Note | APIValidationError[] | APIError>(
      `/notes/${note.id}`,
      {
        title: note.title,
        body: note.body,
      }
    );

    if (response.status === 200) return { status: 'success', note: response.data as Note };
    if (response.status === 401) return { status: 'error', type: (response.data as APIError).type };
    if (response.status === 422) {
      return { status: 'validation_error', errors: response.data as APIValidationError[] };
    }
    throw handleError(response);
  }

  public async removeNote(id: string): Promise<void> {
    const response = await this.httpClient.delete<undefined | APIError>(`/notes/${id}`);
    if (response.status === 200) return;
    if (response.status === 401) return;

    throw handleError(response);
  }
}

export interface APIError {
  type: string;
}

export interface APIValidationError {
  field: string;
  type: string;
}
