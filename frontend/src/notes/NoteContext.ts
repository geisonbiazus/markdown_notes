import { AppConfig } from '../app';
import { HTTPClient, PubSub, uuid } from '../utils';
import { APINoteClient, InMemoryNoteClient } from './clients';
import { NoteClient } from './entities';
import { NOTE_REMOVED_EVENT, NOTE_SAVED_EVENT } from './events';
import { EditNoteInteractor, ListNoteInteractor, RemoveNoteInteractor } from './interactors';

export class NoteContext {
  private editNoteInteractorInstance?: EditNoteInteractor;
  private listNoteInteractorInstance?: ListNoteInteractor;
  private removeNoteInteractorInstance?: RemoveNoteInteractor;
  private noteClientInstance?: NoteClient;

  constructor(private httpClient: HTTPClient, private pubSub: PubSub, private config: AppConfig) {}

  public startSubscribers(): void {
    this.pubSub.subscribe(NOTE_SAVED_EVENT, () => this.listNoteInteractor.getNotes());
    this.pubSub.subscribe(NOTE_REMOVED_EVENT, () => this.listNoteInteractor.getNotes());
  }

  public get editNoteInteractor(): EditNoteInteractor {
    if (!this.editNoteInteractorInstance) {
      this.editNoteInteractorInstance = new EditNoteInteractor(this.noteClient, this.pubSub);
    }
    return this.editNoteInteractorInstance;
  }

  public get listNoteInteractor(): ListNoteInteractor {
    if (!this.listNoteInteractorInstance) {
      this.listNoteInteractorInstance = new ListNoteInteractor(this.noteClient);
    }
    return this.listNoteInteractorInstance;
  }

  public get removeNoteInteractor(): RemoveNoteInteractor {
    if (!this.removeNoteInteractorInstance) {
      this.removeNoteInteractorInstance = new RemoveNoteInteractor(this.noteClient, this.pubSub);
    }
    return this.removeNoteInteractorInstance;
  }

  public get noteClient(): NoteClient {
    if (!this.noteClientInstance) {
      this.noteClientInstance = this.config.devMode
        ? this.initializeInMemoryNoteClient()
        : new APINoteClient(this.httpClient);
    }
    return this.noteClientInstance;
  }

  private initializeInMemoryNoteClient(): InMemoryNoteClient {
    const client = new InMemoryNoteClient();

    client.saveNote({ id: uuid(), title: 'Note 1', body: 'Content 1' });
    client.saveNote({ id: uuid(), title: 'Note 2', body: 'Content 2' });
    client.saveNote({ id: uuid(), title: 'Note 3', body: 'Content 3' });

    return client;
  }
}
