import 'reflect-metadata';
import { Server } from './api';
import { TypeORMRepository } from './notes';
import { createConnection, Connection } from 'typeorm';

createConnection().then((connection: Connection) => {
  const repository = new TypeORMRepository(connection.manager);

  new Server(repository).start();
});
