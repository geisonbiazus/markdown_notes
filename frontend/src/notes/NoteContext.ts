import { HTTPClient, PubSub } from '../utils';
import { APINoteClient } from './clients';
import { NoteClient } from './entities';
import { NOTE_REMOVED_EVENT, NOTE_SAVED_EVENT } from './events';
import { EditNoteInteractor, ListNoteInteractor, RemoveNoteInteractor } from './interactors';

export class NoteContext {
  private editNoteInteractorInstance?: EditNoteInteractor;
  private listNoteInteractorInstance?: ListNoteInteractor;
  private removeNoteInteractorInstance?: RemoveNoteInteractor;

  constructor(private httpClient: HTTPClient, private pubSub: PubSub) {}

  public startSubscribers(): void {
    this.pubSub.subscribe(NOTE_SAVED_EVENT, () => this.listNoteInteractor.getNotes());
    this.pubSub.subscribe(NOTE_REMOVED_EVENT, () => this.listNoteInteractor.getNotes());
  }

  public get noteClient(): NoteClient {
    return new APINoteClient(this.httpClient);
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
}
