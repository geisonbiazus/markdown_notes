import bind from 'bind-decorator';
import { Request, RequestHandler, Response } from 'express';
import { AuthenticationContext } from '../../authentication/AuthenticationContext';
import { User } from '../../authentication/entities/User';

export type AuthenticatedAction = (req: Request, res: Response, user: User) => Promise<void> | void;

export class AuthenticationMiddleware {
  constructor(private context: AuthenticationContext) {}

  @bind
  public authenticate(action: AuthenticatedAction): RequestHandler {
    return async (req: Request, res: Response) => {
      const token = this.getToken(req);

      if (!token) return this.unauthorized(res);

      const user = await this.context.getAuthenticatedUserUseCase.run(token);

      if (!user) return this.unauthorized(res);

      return action(req, res, user);
    };
  }

  private getToken(req: Request): string | undefined {
    const header = req.header('Authorization');
    return header?.split('Bearer ')[1];
  }

  private unauthorized(res: Response) {
    res.status(401);
    res.json({ type: 'unauthorized' });
  }
}
