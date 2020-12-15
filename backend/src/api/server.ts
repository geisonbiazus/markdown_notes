import cors from 'cors';
import express, { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import { AppContext } from '../AppContext';
import { APIContext } from './APIContext';
import { Router } from './router';
import { swaggerDocument } from './swagger';

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
    this.server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  }

  start() {
    this.server.listen(this.port, () =>
      console.log(`App listening at http://localhost:${this.port}`)
    );
  }
}
