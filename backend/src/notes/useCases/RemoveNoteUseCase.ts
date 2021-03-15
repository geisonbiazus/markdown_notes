import { NoteRepository } from '../ports/NoteRepository';

export class RemoveNoteUseCase {
  constructor(private repo: NoteRepository) {}

  public async run(id: string): Promise<boolean> {
    const note = await this.repo.getNoteById(id);

    if (!note) return false;

    await this.repo.removeNote(note);

    return true;
  }
}
