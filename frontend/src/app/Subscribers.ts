import { AppContext } from './AppContext';

export class Subscribers {
  constructor(private appContext: AppContext) {}

  public start() {
    this.appContext.pubSub.subscribe(
      'user_authenticated',
      (event: string, payload: { token: string }) => {
        this.appContext.authenticatedHTTPClient.setToken(payload.token);
      }
    );
  }
}
