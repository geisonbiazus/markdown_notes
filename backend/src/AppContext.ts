import { AuthenticationContext } from './authentication';
import { Config } from './Config';
import { NotesContext } from './notes';

export class AppContext {
  public config: Config;

  private authenticationContext?: AuthenticationContext;
  private notesContext?: NotesContext;

  constructor() {
    this.config = new Config();
  }

  public get authentication(): AuthenticationContext {
    if (!this.authenticationContext) {
      this.authenticationContext = new AuthenticationContext(this.config);
    }
    return this.authenticationContext;
  }

  public get notes(): NotesContext {
    if (!this.notesContext) {
      this.notesContext = new NotesContext(this.config);
    }
    return this.notesContext;
  }
}
