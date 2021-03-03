import { Note } from '../entities/Note';
import { NoteRepository } from '../ports/NoteRepository';

export class GetNotesUseCase {
  constructor(private repo: NoteRepository) {}

  public async run(userId: string): Promise<Note[]> {
    return await this.repo.getUserNotesSortedByTitle(userId);
  }
}
