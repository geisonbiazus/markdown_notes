import { AuthenticationContext } from './authentication';
import { NotesContext } from './notes';

export class AppContext {
  private authenticationContext?: AuthenticationContext;
  private notesContext?: NotesContext;

  public get authentication(): AuthenticationContext {
    if (!this.authenticationContext) {
      this.authenticationContext = new AuthenticationContext();
    }
    return this.authenticationContext;
  }

  public get notes(): NotesContext {
    if (!this.notesContext) {
      this.notesContext = new NotesContext();
    }
    return this.notesContext;
  }
}
