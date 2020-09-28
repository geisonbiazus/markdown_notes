import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'notes' })
export class NoteDB {
  @PrimaryColumn()
  id?: string;

  @Column()
  title?: string;

  @Column()
  body?: string;
}