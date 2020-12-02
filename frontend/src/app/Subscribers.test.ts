import { AppContext } from './AppContext';
import { Subscribers } from './Subscribers';

describe('Subscribers', () => {
  let appContext: AppContext;
  let subscribers: Subscribers;

  beforeEach(() => {
    appContext = new AppContext();
    subscribers = new Subscribers(appContext);
    subscribers.start();
  });

  describe('user_authenticated', () => {
    it('sets token to authenticatedHTTPClient', () => {
      const token = 'token';
      appContext.pubSub.pusblish('user_authenticated', { token });
      expect(appContext.authenticatedHTTPClient.token).toEqual(token);
    });
  });
});
