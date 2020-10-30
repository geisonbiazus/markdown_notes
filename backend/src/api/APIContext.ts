import { AppContext } from '../AppContext';
import { AuthenticationController, NoteController } from './controllers';
import { AuthenticationMiddleware } from './middleware';

export class APIContext {
  constructor(private appContext: AppContext) {}

  public get authenticationMidleware(): AuthenticationMiddleware {
    return new AuthenticationMiddleware(this.appContext.authentication.authenticationInteractor);
  }

  public get authenticationController(): AuthenticationController {
    return new AuthenticationController(this.appContext.authentication.authenticationInteractor);
  }

  public get noteController(): NoteController {
    return new NoteController(this.appContext.notes.noteInteractor);
  }
}