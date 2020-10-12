import express, { Express } from 'express';
import { Router } from './router';
import { NoteInteractor, InMemoryRepository, Repository } from '../notes';
import { NoteController } from './controllers';
import cors from 'cors';
import { AppContext } from '../AppContext';

export class Server {
  public server: Express;
  public port = process.env.PORT || 4000;

  constructor(context: AppContext) {
    const noteController = new NoteController(context.noteInteractor);
    const router = new Router(noteController);

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
