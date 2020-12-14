import bind from 'bind-decorator';
import { Request, Response } from 'express';
import { AuthenticationInteractor } from '../../authentication';
import { resolveHttpStatus } from '../helpers';

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
}
