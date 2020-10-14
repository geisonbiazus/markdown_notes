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
  TypeORMNoteRepository,
} from './notes';

export class AppContext {
  public noteRepository: NoteRepository;
  public authenticationRepository: AuthenticationRepository;

  public noteInteractor: NoteInteractor;
  public authenticationInteractor: AuthenticationInteractor;

  public passwordManager: PasswordManager;

  constructor() {
    this.noteRepository = this.isTest
      ? new InMemoryNoteRepository()
      : new TypeORMNoteRepository(this.entityManager);

    this.authenticationRepository = new InMemoryAuthenticationRepository();

    this.noteInteractor = new NoteInteractor(this.noteRepository);

    this.passwordManager = new PasswordManager('secret');

    this.authenticationInteractor = new AuthenticationInteractor(
      this.authenticationRepository,
      new TokenManager('secret'),
      this.passwordManager
    );
  }

  private get isTest(): boolean {
    return process.env.NODE_ENV == 'test';
  }

  private get entityManager(): EntityManager {
    return getConnection().manager;
  }
}
