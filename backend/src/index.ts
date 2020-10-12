import 'reflect-metadata';
import { Server } from './api';
import { createConnection, Connection } from 'typeorm';
import { AppContext } from './AppContext';

createConnection().then((connection: Connection) => {
  const context = new AppContext();

  new Server(context).start();
});
