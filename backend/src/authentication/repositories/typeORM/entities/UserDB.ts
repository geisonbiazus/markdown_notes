import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class UserDB {
  @PrimaryColumn()
  id?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;
}
