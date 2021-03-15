import bind from 'bind-decorator';
import { Request, response, Response } from 'express';
import { AuthenticationContext } from '../../authentication/AuthenticationContext';

export class AuthenticationController {
  private context: AuthenticationContext;

  constructor(context: AuthenticationContext) {
    this.context = context;
  }

  @bind
  public async signIn(req: Request, res: Response): Promise<void> {
    const response = await this.context.authenticateUseCase.run(
      req.body.email || '',
      req.body.password || ''
    );

    if (response.status == 'success') {
      res.status(200);
      res.json(response);
    } else if (response.type == 'pending_user') {
      res.status(403);
      res.json({ type: 'pending_user' });
    } else {
      res.status(404);
      res.json({ type: 'not_found' });
    }
  }

  @bind
  public async register(req: Request, res: Response): Promise<void> {
    const request = {
      name: req.body.name || '',
      email: req.body.email || '',
      password: req.body.password || '',
    };

    const response = await this.context.registerUserUseCase.run(request);

    if (response.status == 'success') {
      const { name, email, status } = response.user;
      res.status(201);
      res.json({ name, email, status });
    } else if (response.status == 'validation_error') {
      res.status(422);
      res.json(response.validationErrors);
    } else {
      res.status(409);
      res.json({ type: response.type });
    }
  }

  @bind
  public async activateUser(req: Request, res: Response): Promise<void> {
    const token = req.body.token || '';
    const isActivated = await this.context.activateUserUseCase.run(token);

    if (isActivated) {
      res.status(202);
      res.json();
    } else {
      res.status(404);
      res.json({ type: 'not_found' });
    }
  }
}
