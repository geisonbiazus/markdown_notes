import { EntityManager } from 'typeorm';
import { Note } from '../../entities/Note';
import { NoteRepository } from '../../ports/NoteRepository';
import { NoteDB } from './typeORM/entities/NoteDB';

export class TypeORMNoteRepository implements NoteRepository {
  constructor(private entityManager: EntityManager) {}

  async getNoteById(id: string): Promise<Note | null> {
    const record = await this.entityManager.findOne(NoteDB, id);

    if (!record) return null;

    return new Note(record);
  }

  async saveNote(note: Note): Promise<void> {
    const record = new NoteDB();
    record.id = note.id;
    record.title = note.title;
    record.body = note.body;
    record.html = note.html;
    record.userId = note.userId;

    await this.entityManager.save(record);
  }

  async getUserNotesSortedByTitle(userId: string): Promise<Note[]> {
    const records = await this.entityManager.find(NoteDB, {
      where: { userId },
      order: { title: 'ASC' },
    });
    return records.map((record) => new Note(record));
  }

  async removeNote(note: Note): Promise<void> {
    this.entityManager.delete(NoteDB, note.id);
  }
}
