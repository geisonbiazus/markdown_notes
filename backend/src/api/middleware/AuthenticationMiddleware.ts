import { Request, RequestHandler, Response } from 'express';
import { AuthenticationFacade } from '../../authentication/AuthenticationFacade';
import { User } from '../../authentication/entities/User';

export type AuthenticatedAction = (req: Request, res: Response, user: User) => Promise<void> | void;

export class AuthenticationMiddleware {
  constructor(private authenticationFacade: AuthenticationFacade) {}

  public authenticate = (action: AuthenticatedAction): RequestHandler => {
    const authenticationInteractor = this.authenticationFacade;

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
