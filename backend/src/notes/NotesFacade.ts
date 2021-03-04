import { getConnection } from 'typeorm';
import { MarkdownConverter } from './entities/MarkdownConverter';
import { Note } from './entities/Note';
import { NoteRepository } from './ports/NoteRepository';
import { InMemoryNoteRepository } from './repositories/InMemoryNoteRepository';
import { TypeORMNoteRepository } from './repositories/TypeORMNoteRepository';
import { GetNotesUseCase } from './useCases/GetNotesUseCase';
import { GetNoteUseCase } from './useCases/GetNoteUseCase';
import { RemoveNoteUseCase } from './useCases/RemoveNoteUseCase';
import { SaveNoteRequest, SaveNoteResponse, SaveNoteUseCase } from './useCases/SaveNoteUseCase';

export interface Config {
  env: string;
}

export class NotesFacade {
  constructor(public config: Config) {}

  public saveNote(request: SaveNoteRequest): Promise<SaveNoteResponse> {
    return new SaveNoteUseCase(this.noteRepository, new MarkdownConverter()).run(request);
  }

  public getNote(userId: string, noteId: string): Promise<Note | null> {
    return new GetNoteUseCase(this.noteRepository).run(userId, noteId);
  }

  public getNotes(userId: string): Promise<Note[]> {
    return new GetNotesUseCase(this.noteRepository).run(userId);
  }

  public removeNote(id: string): Promise<boolean> {
    return new RemoveNoteUseCase(this.noteRepository).run(id);
  }

  public get noteRepository(): NoteRepository {
    return this.config.env == 'test'
      ? InMemoryNoteRepository.instance
      : new TypeORMNoteRepository(getConnection().manager);
  }
}
