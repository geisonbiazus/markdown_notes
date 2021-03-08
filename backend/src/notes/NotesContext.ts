import { getConnection } from 'typeorm';
import { NotesFacade } from './NotesFacade';
import { NoteRepository } from './ports/NoteRepository';
import { InMemoryNoteRepository } from './repositories/InMemoryNoteRepository';
import { TypeORMNoteRepository } from './repositories/TypeORMNoteRepository';

export interface Config {
  env: string;
}

export class NotesContext {
  constructor(public config: Config) {}

  public get facade(): NotesFacade {
    return new NotesFacade(this);
  }

  private repositoryInstance?: NoteRepository;

  public get repository(): NoteRepository {
    if (this.config.env !== 'test') return new TypeORMNoteRepository(getConnection().manager);
    if (!this.repositoryInstance) this.repositoryInstance = new InMemoryNoteRepository();
    return this.repositoryInstance;
  }
}
