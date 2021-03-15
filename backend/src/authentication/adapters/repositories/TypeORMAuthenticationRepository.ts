import { EntityManager } from 'typeorm';
import { User } from '../../entities/User';
import { AuthenticationRepository } from '../../ports/AuthenticationRepository';
import { UserDB } from './typeORM/entities/UserDB';

export class TypeORMAuthenticationRepository implements AuthenticationRepository {
  constructor(private entityManager: EntityManager) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    const records = await this.entityManager.find(UserDB, {
      where: { email },
    });

    if (!records.length) return null;

    return new User(records[0]);
  }

  public async getUserById(id: string): Promise<User | null> {
    const record = await this.entityManager.findOne(UserDB, id);

    if (!record) return null;

    return new User(record!);
  }

  public async saveUser(user: User): Promise<void> {
    const record = new UserDB();
    record.id = user.id;
    record.name = user.name;
    record.email = user.email;
    record.password = user.password;
    record.status = user.status;

    await this.entityManager.save(record);
  }
}
