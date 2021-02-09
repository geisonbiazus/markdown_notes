import { connect, dbTest, disconnect, uuid } from '../../utils';
import { User } from '../entities';
import { TypeORMAuthenticationRepository } from './TypeORMAuthenticationRepository';

describe('TypeORMAuthenticationRepository', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('saveUser', () => {
    it(
      'saves a new user',
      dbTest(async (entityManager) => {
        const repository = new TypeORMAuthenticationRepository(entityManager);
        const user = new User({
          id: uuid(),
          name: 'User Name',
          email: 'user@example.com',
          password: 'password',
          status: 'active',
        });

        await repository.saveUser(user);

        expect(await repository.getUserById(user.id)).toEqual(user);
      })
    );

    it(
      'updates existing user',
      dbTest(async (entityManager) => {
        const repository = new TypeORMAuthenticationRepository(entityManager);
        const user = new User({
          id: uuid(),
          name: 'User Name',
          email: 'user@example.com',
          password: 'password',
          status: 'active',
        });

        await repository.saveUser(user);

        user.email = 'another.email@example.com';

        await repository.saveUser(user);

        expect(await repository.getUserById(user.id)).toEqual(user);
      })
    );

    describe('getUserById', () => {
      it(
        'returns null when user does not exist',
        dbTest(async (entityManager) => {
          const repository = new TypeORMAuthenticationRepository(entityManager);
          expect(await repository.getUserById(uuid())).toEqual(null);
        })
      );

      it(
        'returns user when it exists',
        dbTest(async (entityManager) => {
          const repository = new TypeORMAuthenticationRepository(entityManager);
          const user = new User({
            id: uuid(),
            name: 'User Name',
            email: 'user@example.com',
            password: 'password',
            status: 'active',
          });

          await repository.saveUser(user);

          expect(await repository.getUserById(user.id)).toEqual(user);
        })
      );
    });

    describe('getUserByEmail', () => {
      it(
        'returns null when user does not exist',
        dbTest(async (entityManager) => {
          const repository = new TypeORMAuthenticationRepository(entityManager);
          const email = 'user@example.com';
          expect(await repository.getUserByEmail(email)).toEqual(null);
        })
      );

      it(
        'returns user when it exists',
        dbTest(async (entityManager) => {
          const repository = new TypeORMAuthenticationRepository(entityManager);
          const user = new User({
            id: uuid(),
            name: 'User Name',
            email: 'user@example.com',
            password: 'password',
            status: 'active',
          });

          await repository.saveUser(user);

          expect(await repository.getUserByEmail(user.email)).toEqual(user);
        })
      );
    });
  });
});
