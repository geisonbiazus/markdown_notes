import express from 'express';
import * as path from 'path';
import { APIContext } from './APIContext';

export class Router {
  public router: express.Router;
  public context: APIContext;

  constructor(apiContext: APIContext) {
    this.context = apiContext;
    this.router = express.Router();
    this.router.use(express.json());
    this.assignRoutes();
  }

  private assignRoutes(): void {
    const auth = this.context.authenticationMidleware.authenticate;

    this.router.get('/', (_req, res) => {
      res.send('MarkdownNotes API');
    });

    this.router.use('/public/', express.static(path.join(__dirname, 'public')));

    this.router.post('/sign_in', this.context.authenticationController.signIn);

    this.router.get('/notes', auth(this.context.noteController.getNotes));
    this.router.get('/notes/:id', auth(this.context.noteController.getNote));
    this.router.put('/notes/:id', auth(this.context.noteController.saveNote));
    this.router.delete('/notes/:id', auth(this.context.noteController.removeNote));
  }
}
