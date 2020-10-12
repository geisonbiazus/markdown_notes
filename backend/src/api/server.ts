import express, { Express } from 'express';
import { Router } from './router';
import { NoteInteractor, InMemoryRepository, Repository } from '../notes';
import { AuthenticationController, NoteController } from './controllers';
import cors from 'cors';
import { AppContext } from '../AppContext';

export class Server {
  public server: Express;
  public port = process.env.PORT || 4000;

  constructor(context: AppContext) {
    const noteController = new NoteController(context.noteInteractor);
    const authenticationController = new AuthenticationController(context.authenticationInteractor);
    const router = new Router(noteController, authenticationController);

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
