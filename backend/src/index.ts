import 'reflect-metadata';
import { Server } from './api/Server';
import { AppContext } from './AppContext';

const context = new AppContext();

context.initialize().then(() => {
  context.startSubscribers().then(() => {
    new Server(context).start();
  });
});
