import bind from 'bind-decorator';
import { Request, response, Response } from 'express';
import { AuthenticationInteractor } from '../../authentication';

export class AuthenticationController {
  private authenticationInteractor: AuthenticationInteractor;

  constructor(authenticationInteractor: AuthenticationInteractor) {
    this.authenticationInteractor = authenticationInteractor;
  }

  @bind
  public async signIn(req: Request, res: Response): Promise<void> {
    const response = await this.authenticationInteractor.authenticate(
      req.body.email,
      req.body.password
    );

    if (response) {
      res.status(200);
      res.json(response);
    } else {
      res.status(404);
      res.json({ type: 'not_found' });
    }
  }

  @bind
  public async register(req: Request, res: Response): Promise<void> {
    const request = {
      email: req.body.email,
      password: req.body.password,
    };

    const response = await this.authenticationInteractor.registerUser(request);

    if (response.status == 'success') {
      const { email, status } = response.user;
      res.status(201);
      res.json({ email, status });
    } else if (response.status == 'validation_error') {
      res.status(422);
      res.json(response.validationErrors);
    } else {
      res.status(409);
      res.json({ type: response.type });
    }
  }
}
