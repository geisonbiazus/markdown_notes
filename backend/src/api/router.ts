import express from 'express';
import { APIContext } from './APIContext';

export class Router {
  public router: express.Router;
  public apiContext: APIContext;

  constructor(apiContext: APIContext) {
    this.apiContext = apiContext;
    this.router = express.Router();
    this.router.use(express.json());
    this.assignRoutes();
  }

  private assignRoutes(): void {
    const auth = this.apiContext.authenticationMiddleware.authenticate;

    this.router.get('/', (_req, res) => {
      res.send('MarkdownNotes API');
    });

    this.router.post('/sign_in', this.apiContext.authenticationController.signIn);

    this.router.get('/notes', auth(this.apiContext.noteController.getNotes));
    this.router.get('/notes/:id', auth(this.apiContext.noteController.getNote));
    this.router.put('/notes/:id', auth(this.apiContext.noteController.saveNote));
    this.router.delete('/notes/:id', auth(this.apiContext.noteController.removeNote));
  }
}
