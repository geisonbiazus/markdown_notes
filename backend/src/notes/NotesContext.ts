import { getConnection } from 'typeorm';
import { MarkedMarkdownConverter } from './adapters/markdownConverter/MarkedMarkdownConverter';
import { InMemoryNoteRepository } from './adapters/repositories/InMemoryNoteRepository';
import { TypeORMNoteRepository } from './adapters/repositories/TypeORMNoteRepository';
import { MarkdownConverter } from './ports/MarkdownConverter';
import { NoteRepository } from './ports/NoteRepository';
import { GetNotesUseCase } from './useCases/GetNotesUseCase';
import { GetNoteUseCase } from './useCases/GetNoteUseCase';
import { RemoveNoteUseCase } from './useCases/RemoveNoteUseCase';
import { SaveNoteUseCase } from './useCases/SaveNoteUseCase';

export interface Config {
  env: string;
}

export class NotesContext {
  constructor(public config: Config) {}

  public get saveNoteUseCase(): SaveNoteUseCase {
    return new SaveNoteUseCase(this.repository, this.markdownConverter);
  }

  public get getNoteUseCase(): GetNoteUseCase {
    return new GetNoteUseCase(this.repository);
  }

  public get getNotesUseCase(): GetNotesUseCase {
    return new GetNotesUseCase(this.repository);
  }

  public get removeNoteUseCase(): RemoveNoteUseCase {
    return new RemoveNoteUseCase(this.repository);
  }

  private repositoryInstance?: NoteRepository;

  public get repository(): NoteRepository {
    if (this.config.env !== 'test') return new TypeORMNoteRepository(getConnection().manager);
    if (!this.repositoryInstance) this.repositoryInstance = new InMemoryNoteRepository();
    return this.repositoryInstance;
  }

  public get markdownConverter(): MarkdownConverter {
    return new MarkedMarkdownConverter();
  }
}
