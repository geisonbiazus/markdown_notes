import express from 'express';
import swaggerUI from 'swagger-ui-express';
import { APIContext } from './APIContext';
import { swaggerDocument } from './swagger';

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

    this.router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    this.router.get('/', (_req, res) => {
      res.redirect('/api-docs');
    });

    this.router.post('/sign_in', this.context.authenticationController.signIn);

    this.router.get('/notes', auth(this.context.noteController.getNotes));
    this.router.get('/notes/:id', auth(this.context.noteController.getNote));
    this.router.put('/notes/:id', auth(this.context.noteController.saveNote));
    this.router.delete('/notes/:id', auth(this.context.noteController.removeNote));
  }
}
