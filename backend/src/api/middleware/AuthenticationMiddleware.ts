import { Request, RequestHandler, Response } from 'express';
import { AuthenticationInteractor, User } from '../../authentication';

export type AuthenticatedAction = (req: Request, res: Response, user: User) => Promise<void> | void;

export class AuthenticationMiddleware {
  constructor(private authenticationInteractor: AuthenticationInteractor) {}

  public authenticate = (action: AuthenticatedAction): RequestHandler => {
    const authenticationInteractor = this.authenticationInteractor;

    return async (req: Request, res: Response) => {
      const token = this.getToken(req);

      if (!token) return this.unauthorized(res);

      const user = await authenticationInteractor.getAuthenticatedUser(token);

      if (!user) return this.unauthorized(res);

      return action(req, res, user);
    };
  };

  private getToken(req: Request): string | undefined {
    const header = req.header('Authorization');
    return header?.split('Bearer ')[1];
  }

  private unauthorized(res: Response) {
    res.status(401);
    res.json({ type: 'unauthorized' });
  }
}
