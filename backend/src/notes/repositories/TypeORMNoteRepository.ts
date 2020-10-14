import { NoteRepository } from '../interactors';
import { Note } from '../entities';
import { EntityManager } from 'typeorm';
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

    await this.entityManager.save(record);
  }

  async getNotesSortedByTitle(): Promise<Note[]> {
    const records = await this.entityManager.find(NoteDB, { order: { title: 'ASC' } });
    return records.map((record) => new Note(record));
  }

  async removeNote(note: Note): Promise<void> {
    this.entityManager.delete(NoteDB, note.id);
  }
}
