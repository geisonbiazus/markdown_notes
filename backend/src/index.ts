import 'reflect-metadata';
import { Server } from './api';
import { createConnection } from 'typeorm';
import { AppContext } from './AppContext';

createConnection().then(() => {
  const context = new AppContext();

  new Server(context).start();
});
