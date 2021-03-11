import { AppConfig } from '../app/AppConfig';
import { HTTPClient } from '../utils/HTTPClient';
import { PubSub } from '../utils/pub_sub/PubSub';
import { uuid } from '../utils/uuid';
import { APINoteClient } from './clients/APINoteClient';
import { InMemoryNoteClient } from './clients/InMemoryNoteClient';
import { NoteClient } from './entities';
import {
  NoteLoadedForEditingPayload,
  NoteLoadedForShowingPayload,
  NoteSavedPayload,
  NOTE_LOADED_FOR_EDITING_EVENT,
  NOTE_LOADED_FOR_SHOWING_EVENT,
  NOTE_REMOVED_EVENT,
  NOTE_SAVED_EVENT,
} from './events';
import { EditNoteInteractor } from './interactors/EditNoteInteractor';
import { ListNoteInteractor } from './interactors/ListNoteInteractor';
import { RemoveNoteInteractor } from './interactors/RemoveNoteInteractor';
import { ShowNoteInteractor } from './interactors/ShowNoteInteractor';

export class NoteContext {
  private showNoteInteractorInstance?: ShowNoteInteractor;
  private editNoteInteractorInstance?: EditNoteInteractor;
  private listNoteInteractorInstance?: ListNoteInteractor;
  private removeNoteInteractorInstance?: RemoveNoteInteractor;
  private noteClientInstance?: NoteClient;

  constructor(private httpClient: HTTPClient, private pubSub: PubSub, private config: AppConfig) {}

  public startSubscribers(): void {
    this.pubSub.subscribe(NOTE_SAVED_EVENT, () => this.listNoteInteractor.getNotes());
    this.pubSub.subscribe(NOTE_REMOVED_EVENT, () => this.listNoteInteractor.getNotes());

    this.pubSub.subscribe(NOTE_LOADED_FOR_SHOWING_EVENT, (payload: NoteLoadedForShowingPayload) =>
      this.listNoteInteractor.setActiveNoteId(payload.id)
    );

    this.pubSub.subscribe(NOTE_LOADED_FOR_EDITING_EVENT, (payload: NoteLoadedForEditingPayload) =>
      this.listNoteInteractor.setActiveNoteId(payload.id)
    );

    this.pubSub.subscribe(NOTE_SAVED_EVENT, (payload: NoteSavedPayload) =>
      this.listNoteInteractor.setActiveNoteId(payload.id)
    );
  }

  public get showNoteInteractor(): ShowNoteInteractor {
    if (!this.showNoteInteractorInstance) {
      this.showNoteInteractorInstance = new ShowNoteInteractor(this.noteClient, this.pubSub);
    }
    return this.showNoteInteractorInstance;
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
