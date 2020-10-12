import express from 'express';
import { AuthenticationController, NoteController } from './controllers';

export class Router {
  public router: express.Router;

  private noteController: NoteController;
  private authenticationController: AuthenticationController;

  constructor(noteController: NoteController, authenticationController: AuthenticationController) {
    this.router = express.Router();
    this.router.use(express.json());
    this.noteController = noteController;
    this.authenticationController = authenticationController;
    this.assignRoutes();
  }

  private assignRoutes(): void {
    this.router.get('/', (_req, res) => {
      res.send('MarkdownNotes API');
    });

    this.router.post('/sign_in', this.authenticationController.signIn);

    this.router.get('/notes', this.noteController.getNotes);
    this.router.get('/notes/:id', this.noteController.getNote);
    this.router.put('/notes/:id', this.noteController.saveNote);
    this.router.delete('/notes/:id', this.noteController.removeNote);
  }
}
