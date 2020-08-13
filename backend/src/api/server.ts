import express, { Express } from 'express';
import { Router } from './router';
import { NoteInteractor, InMemoryRepository, Repository } from '../notes';
import { NoteController } from './controllers';
import cors from 'cors';

export class Server {
  public server: Express;
  public port = 4000;

  constructor(repo: Repository = new InMemoryRepository()) {
    const interactor = new NoteInteractor(repo);
    const noteController = new NoteController(interactor);
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
