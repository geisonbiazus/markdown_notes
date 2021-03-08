import { MarkdownConverter } from './entities/MarkdownConverter';
import { Note } from './entities/Note';
import { NotesContext } from './NotesContext';
import { GetNotesUseCase } from './useCases/GetNotesUseCase';
import { GetNoteUseCase } from './useCases/GetNoteUseCase';
import { RemoveNoteUseCase } from './useCases/RemoveNoteUseCase';
import { SaveNoteRequest, SaveNoteResponse, SaveNoteUseCase } from './useCases/SaveNoteUseCase';

export interface Config {
  env: string;
}

export class NotesFacade {
  constructor(public context: NotesContext) {}

  public saveNote(request: SaveNoteRequest): Promise<SaveNoteResponse> {
    return new SaveNoteUseCase(this.context.repository, new MarkdownConverter()).run(request);
  }

  public getNote(userId: string, noteId: string): Promise<Note | null> {
    return new GetNoteUseCase(this.context.repository).run(userId, noteId);
  }

  public getNotes(userId: string): Promise<Note[]> {
    return new GetNotesUseCase(this.context.repository).run(userId);
  }

  public removeNote(id: string): Promise<boolean> {
    return new RemoveNoteUseCase(this.context.repository).run(id);
  }
}
