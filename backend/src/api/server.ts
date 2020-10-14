import express, { Express } from 'express';
import { Router } from './router';
import cors from 'cors';
import { AppContext } from '../AppContext';
import { APIContext } from './APIContext';

export class Server {
  public server: Express;
  public port = process.env.PORT || 4000;

  constructor(appContext: AppContext) {
    const apiContext = new APIContext(appContext);

    const router = new Router(apiContext);

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
