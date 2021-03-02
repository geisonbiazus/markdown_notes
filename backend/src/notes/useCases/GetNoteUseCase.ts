import { Note } from '../entities/Note';
import { NoteRepository } from '../ports/NoteRepository';

export class GetNoteUseCase {
  constructor(private repo: NoteRepository) {}

  public async getNote(userId: string, noteId: string): Promise<Note | null> {
    const note = await this.repo.getNoteById(noteId);

    if (!note) return null;
    if (note.userId !== userId) return null;

    return note;
  }
}
