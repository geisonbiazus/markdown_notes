import { EntityManager, getConnection, createConnection } from 'typeorm';

export type TransactionalCallback = (entityManager: EntityManager) => Promise<any>;

export const connect = async () => {
  await createConnection();
};

export const disconnect = async () => {
  getConnection().close();
};

export function dbTest(callback: TransactionalCallback) {
  return async () => await runInTransactionAndRollback(callback);
}

export const runInTransactionAndRollback = async (callback: TransactionalCallback) => {
  try {
    await getConnection().transaction(async (entityManager: EntityManager) => {
      await callback(entityManager);
      throw new RollbackTransactionError();
    });
  } catch (e) {
    const error = e as RollbackTransactionError;
    if (!error.isRollback) throw e;
  }
};

export class RollbackTransactionError extends Error {
  public isRollback: boolean;

  constructor() {
    super();
    this.isRollback = true;
  }
}
