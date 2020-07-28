import express, { Express } from 'express';
import { Router } from './router';

export class App {
  public server: Express;
  public port = 4000;

  constructor() {
    const router = new Router();
    this.server = express();
    this.server.use(router.router);
  }

  start() {
    this.server.listen(this.port, () =>
      console.log(`App listening at http://localhost:${this.port}`)
    );
  }
}
