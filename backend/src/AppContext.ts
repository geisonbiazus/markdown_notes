import { getConnection } from 'typeorm';
import {
  AuthenticationInteractor,
  AuthenticationRepository,
  InMemoryAuthenticationRepository,
} from './authentication';
import { PasswordManager, TokenManager } from './authentication/entities';
import { InMemoryRepository, NoteInteractor, Repository, TypeORMRepository } from './notes';

export class AppContext {
  public noteRepository: Repository;
  public authenticationRepository: AuthenticationRepository;
  public noteInteractor: NoteInteractor;
  public authenticationInteractor: AuthenticationInteractor;

  constructor() {
    if (process.env.NODE_ENV == 'test') {
      this.noteRepository = new InMemoryRepository();
    } else {
      this.noteRepository = new TypeORMRepository(getConnection().manager);
    }
    this.authenticationRepository = new InMemoryAuthenticationRepository();

    this.noteInteractor = new NoteInteractor(this.noteRepository);

    this.authenticationInteractor = new AuthenticationInteractor(
      this.authenticationRepository,
      new TokenManager('secret'),
      new PasswordManager('secret')
    );
  }
}
