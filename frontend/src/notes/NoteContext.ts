import { AppConfig } from '../app/AppConfig';
import { HTTPClient } from '../shared/adapters/httpClient/HTTPClient';
import { PubSub } from '../shared/adapters/pubSub/PubSub';
import { uuid } from '../shared/utils/uuid';
import { APINoteClient } from './adapters/noteClient/APINoteClient';
import { InMemoryNoteClient } from './adapters/noteClient/InMemoryNoteClient';
import { NoteClient } from './ports/NoteClient';
import {
  NoteLoadedForEditingPayload,
  NoteLoadedForShowingPayload,
  NoteSavedPayload,
  NOTE_LOADED_FOR_EDITING_EVENT,
  NOTE_LOADED_FOR_SHOWING_EVENT,
  NOTE_REMOVED_EVENT,
  NOTE_SAVED_EVENT,
} from './events';
import { EditNoteStore } from './stores/EditNoteStore';
import { ListNoteStore } from './stores/ListNoteStore';
import { RemoveNoteStore } from './stores/RemoveNoteStore';
import { ShowNoteStore } from './stores/ShowNoteStore';

export class NoteContext {
  private showNoteStoreInstance?: ShowNoteStore;
  private editNoteStoreInstance?: EditNoteStore;
  private listNoteStoreInstance?: ListNoteStore;
  private removeNoteStoreInstance?: RemoveNoteStore;
  private noteClientInstance?: NoteClient;

  constructor(private httpClient: HTTPClient, private pubSub: PubSub, private config: AppConfig) {}

  public startSubscribers(): void {
    this.pubSub.subscribe(NOTE_SAVED_EVENT, () => this.listNoteStore.getNotes());
    this.pubSub.subscribe(NOTE_REMOVED_EVENT, () => this.listNoteStore.getNotes());

    this.pubSub.subscribe(NOTE_LOADED_FOR_SHOWING_EVENT, (payload: NoteLoadedForShowingPayload) =>
      this.listNoteStore.setActiveNoteId(payload.id)
    );

    this.pubSub.subscribe(NOTE_LOADED_FOR_EDITING_EVENT, (payload: NoteLoadedForEditingPayload) =>
      this.listNoteStore.setActiveNoteId(payload.id)
    );

    this.pubSub.subscribe(NOTE_SAVED_EVENT, (payload: NoteSavedPayload) =>
      this.listNoteStore.setActiveNoteId(payload.id)
    );
  }

  public get showNoteStore(): ShowNoteStore {
    if (!this.showNoteStoreInstance) {
      this.showNoteStoreInstance = new ShowNoteStore(this.noteClient, this.pubSub);
    }
    return this.showNoteStoreInstance;
  }

  public get editNoteStore(): EditNoteStore {
    if (!this.editNoteStoreInstance) {
      this.editNoteStoreInstance = new EditNoteStore(this.noteClient, this.pubSub);
    }
    return this.editNoteStoreInstance;
  }

  public get listNoteStore(): ListNoteStore {
    if (!this.listNoteStoreInstance) {
      this.listNoteStoreInstance = new ListNoteStore(this.noteClient);
    }
    return this.listNoteStoreInstance;
  }

  public get removeNoteStore(): RemoveNoteStore {
    if (!this.removeNoteStoreInstance) {
      this.removeNoteStoreInstance = new RemoveNoteStore(this.noteClient, this.pubSub);
    }
    return this.removeNoteStoreInstance;
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

    client.saveNote({
      id: uuid(),
      title: 'Note 1',
      body: '# Content 1',
      html: '<h1>Content 1</h1>',
    });
    client.saveNote({
      id: uuid(),
      title: 'Note 2',
      body: '# Content 2',
      html: '<h1>Content 2</h1>',
    });
    client.saveNote({
      id: uuid(),
      title: 'Note 3',
      body: '# Content 3',
      html: '<h1>Content 3</h1>',
    });

    return client;
  }
}
