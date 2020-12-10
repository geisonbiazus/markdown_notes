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
    const { status, type, data } = response;

    if (status == 'success' && data) {
      res.status(200);
      res.json({ token: data.token });
    } else {
      res.status(404);
      res.json({ type });
    }
  }
}
