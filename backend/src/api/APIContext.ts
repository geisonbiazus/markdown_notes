import { AppContext } from '../AppContext';
import { AuthenticationController, NoteController } from './controllers';
import { AuthenticationMiddleware } from './middleware';

export class APIContext {
  public authenticationMiddleware: AuthenticationMiddleware;

  public noteController: NoteController;
  public authenticationController: AuthenticationController;

  constructor(appContext: AppContext) {
    this.authenticationMiddleware = new AuthenticationMiddleware(
      appContext.authenticationInteractor
    );

    this.noteController = new NoteController(appContext.notes.noteInteractor);
    this.authenticationController = new AuthenticationController(
      appContext.authenticationInteractor
    );
  }
}
