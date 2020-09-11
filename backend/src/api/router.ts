import express from 'express';
import { NoteController } from './controllers';

export class Router {
  public router: express.Router;

  private noteController: NoteController;

  constructor(noteController: NoteController) {
    this.router = express.Router();
    this.router.use(express.json());
    this.noteController = noteController;
    this.assignRoutes();
  }

  private assignRoutes(): void {
    this.router.get('/', (_req, res) => {
      res.send('Hello World!');
    });

    this.router.get('/notes', this.noteController.getNotes);
    this.router.get('/notes/:id', this.noteController.getNote);
    this.router.put('/notes/:id', this.noteController.saveNote);
    this.router.delete('/notes/:id', this.noteController.removeNote);
  }
}
