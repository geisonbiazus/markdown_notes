import { AppContext } from '../AppContext';
import { AuthenticationController, NoteController } from './controllers';

export class APIContext {
  public noteController: NoteController;
  public authenticationController: AuthenticationController;

  constructor(appContext: AppContext) {
    this.noteController = new NoteController(appContext.noteInteractor);
    this.authenticationController = new AuthenticationController(
      appContext.authenticationInteractor
    );
  }
}
