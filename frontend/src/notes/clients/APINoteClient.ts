import { NoteClient, Note, SaveNoteResponse } from '../interactors';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { notDeepEqual } from 'assert';

export class APINoteClient implements NoteClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({ baseURL: 'http://localhost:4000' });
  }

  async saveNote(note: Note): Promise<SaveNoteResponse> {
    try {
      const response = await this.httpClient.put<SaveNoteResponse>(`/notes/${note.id}`, {
        title: note.title,
        body: note.body,
      });

      return response.data;
    } catch (e) {
      console.log(e);
      const error = e as AxiosError<SaveNoteResponse>;
      if (error.response) return error.response.data;
      throw e;
    }
  }
}
