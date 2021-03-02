import { MarkdownConverter, Note } from '../entities';
import { NoteRepository } from '../ports/NoteRepository';
import { GetNotesUseCase } from '../useCases/GetNotesUseCase';
import { GetNoteUseCase } from '../useCases/GetNoteUseCase';
import { RemoveNoteUseCase } from '../useCases/RemoveNoteUseCase';
import { SaveNoteRequest, SaveNoteResponse, SaveNoteUseCase } from '../useCases/SaveNoteUseCase';

export class NoteInteractor {
  constructor(private repo: NoteRepository, private markdownConverter: MarkdownConverter) {}

  public async saveNote(request: SaveNoteRequest): Promise<SaveNoteResponse> {
    return new SaveNoteUseCase(this.repo, this.markdownConverter).saveNote(request);
  }

  public async getNote(userId: string, noteId: string): Promise<Note | null> {
    return new GetNoteUseCase(this.repo).getNote(userId, noteId);
  }

  public async getNotes(userId: string): Promise<Note[]> {
    return new GetNotesUseCase(this.repo).getNotes(userId);
  }

  public async removeNote(id: string): Promise<boolean> {
    return new RemoveNoteUseCase(this.repo).removeNote(id);
  }
}
