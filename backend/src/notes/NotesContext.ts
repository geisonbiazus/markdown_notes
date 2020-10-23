import { EntityManager, getConnection } from 'typeorm';
import { NoteInteractor, NoteRepository } from './interactors';
import { InMemoryNoteRepository, TypeORMNoteRepository } from './repositories';

export class NotesContext {
  private noteRepo?: NoteRepository;

  public get noteInteractor(): NoteInteractor {
    return new NoteInteractor(this.noteRepository);
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
    return process.env.NODE_ENV == 'test';
  }

  private get entityManager(): EntityManager {
    return getConnection().manager;
  }
}
