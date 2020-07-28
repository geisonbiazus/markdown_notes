import express from 'express';
import { NoteInteractor, InMemoryRepository, SaveNoteRequest } from '../notes';

export class Router {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.router.use(express.json());
    this.assignRoutes();
  }

  private assignRoutes(): void {
    this.router.get('/', (_req, res) => {
      res.send('Hello World!');
    });

    this.router.put('/notes/:id', async (req, res) => {
      const interactor = new NoteInteractor(new InMemoryRepository());
      const request = new SaveNoteRequest({
        id: req.param('id'),
        title: req.param('title'),
        body: req.param('body'),
      });
      const response = await interactor.saveNote(request);

      if (response.status === 'error') {
        res.status(422);
        res.json({ status: 'validation_error', errors: response.errors });
      } else {
        res.json({ status: 'success', note: response.data });
      }
    });
  }
}
