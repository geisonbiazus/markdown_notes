import 'reflect-metadata';
import { Server } from './api/server';
import { AppContext } from './AppContext';

const context = new AppContext();

context.initialize().then(() => {
  context.startSubscribers().then(() => {
    new Server(context).start();
  });
});
