import cors from 'cors';
import express, { Express } from 'express';
import { AppContext } from '../AppContext';
import { APIContext } from './APIContext';
import { Router } from './router';

export class Server {
  public server: Express;
  public port: number;

  constructor(appContext: AppContext) {
    const apiContext = new APIContext(appContext);

    const router = new Router(apiContext);

    this.port = appContext.config.port;

    this.server = express();
    this.server.use(cors());
    this.server.use(router.router);
  }

  start() {
    this.server.listen(this.port, () =>
      console.log(`App listening at http://localhost:${this.port}`)
    );
  }
}
