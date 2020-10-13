import { Request, Response } from 'express';
import { AuthenticationInteractor } from '../../authentication';
import { resolveHttpStatus } from '../helpers';

export class AuthenticationController {
  private authenticationInteractor: AuthenticationInteractor;

  constructor(authenticationInteractor: AuthenticationInteractor) {
    this.authenticationInteractor = authenticationInteractor;
  }

  signIn = async (req: Request, res: Response): Promise<void> => {
    const response = await this.authenticationInteractor.authenticate(
      req.body.email,
      req.body.password
    );
    const { status, type, data } = response;

    res.status(resolveHttpStatus(response));

    if (status == 'success' && data) {
      res.json({ status, token: data.token });
    } else {
      res.json({ status, type });
    }
  };
}
