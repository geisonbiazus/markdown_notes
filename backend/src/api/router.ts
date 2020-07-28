import express from 'express';
import { NoteInteractor, InMemoryRepository, SaveNoteRequest } from '../notes';
import { NoteController } from './controllers';

export class Router {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.router.use(express.json());
    this.assignRoutes();
  }

  private assignRoutes(): void {
    const noteController = new NoteController();

    this.router.get('/', (_req, res) => {
      res.send('Hello World!');
    });

    this.router.put('/notes/:id', noteController.saveNote);
  }
}
