import { EntityManager, getConnection } from 'typeorm';
import {
  AuthenticationInteractor,
  AuthenticationRepository,
  InMemoryAuthenticationRepository,
} from './authentication';
import { PasswordManager, TokenManager } from './authentication/entities';
import {
  InMemoryNoteRepository,
  NoteInteractor,
  NoteRepository,
  NotesContext,
  TypeORMNoteRepository,
} from './notes';

export class AppContext {
  public authenticationRepository: AuthenticationRepository;

  public authenticationInteractor: AuthenticationInteractor;

  public passwordManager: PasswordManager;
  public tokenManager: TokenManager;

  private notesContext?: NotesContext;

  constructor() {
    this.authenticationRepository = new InMemoryAuthenticationRepository();

    this.tokenManager = new TokenManager('secret');
    this.passwordManager = new PasswordManager('secret');

    this.authenticationInteractor = new AuthenticationInteractor(
      this.authenticationRepository,
      this.tokenManager,
      this.passwordManager
    );
  }

  public get notes(): NotesContext {
    if (!this.notesContext) {
      this.notesContext = new NotesContext();
    }
    return this.notesContext;
  }
}
