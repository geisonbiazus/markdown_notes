import { Entity, PrimaryColumn, Column } from 'typeorm';
import { UserStatus } from '../../../entities';

@Entity({ name: 'users' })
export class UserDB {
  @PrimaryColumn()
  id?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  status?: UserStatus;
}
