import { EntityManager, getConnection } from 'typeorm';
import { MarkdownConverter } from './entities';
import { NoteInteractor } from './interactors';
import { NoteRepository } from './ports/NoteRepository';
import { InMemoryNoteRepository, TypeORMNoteRepository } from './repositories';

export interface Config {
  env: string;
}

export class NotesContext {
  private noteRepo?: NoteRepository;

  constructor(public config: Config) {}

  public get noteInteractor(): NoteInteractor {
    return new NoteInteractor(this.noteRepository, new MarkdownConverter());
  }

  public get noteRepository(): NoteRepository {
    if (!this.noteRepo) {
      this.noteRepo = this.isTest
        ? new InMemoryNoteRepository()
        : new TypeORMNoteRepository(this.entityManager);
    }

    return this.noteRepo;
  }

  private get isTest(): boolean {
    return this.config.env == 'test';
  }

  private get entityManager(): EntityManager {
    return getConnection().manager;
  }
}
