import { Repository } from '../interactors';
import { Note } from '../entities';
import { Connection } from 'typeorm';
import { NoteDB } from './typeORM/entities/NoteDB';

export class TypeORMRepository implements Repository {
  constructor(private connection: Connection) {}

  async getNoteById(id: string): Promise<Note | null> {
    const record = await this.connection.manager.findOne(NoteDB, id);

    if (!record) return null;

    return new Note(record);
  }

  async saveNote(note: Note): Promise<void> {
    const record = new NoteDB();
    record.id = note.id;
    record.title = note.title;
    record.body = note.body;

    await this.connection.manager.save(record);
  }

  async getNotesSortedByTitle(): Promise<Note[]> {
    const records = await this.connection.manager.find(NoteDB, { order: { title: 'ASC' } });
    return records.map((record) => new Note(record));
  }

  async removeNote(note: Note): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
