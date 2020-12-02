import { HTTPClient } from '../utils';
import { APINoteClient } from './clients';
import { NoteClient } from './entities';

export class NoteContext {
  private noteClientInstance?: NoteClient;

  constructor(private httpClient: HTTPClient) {}

  public get noteClient(): NoteClient {
    if (!this.noteClientInstance) {
      this.noteClientInstance = new APINoteClient(this.httpClient);
    }
    return this.noteClientInstance;
  }
}
