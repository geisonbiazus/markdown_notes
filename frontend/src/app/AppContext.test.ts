import { AppContext } from './AppContext';

describe('AppContext', () => {
  let appContext: AppContext;

  describe('startSubscribers', () => {
    beforeEach(() => {
      appContext = new AppContext();
      appContext.startSubscribers();
    });

    describe('user_authenticated', () => {
      it('sets token to authenticatedHTTPClient', () => {
        const token = 'token';
        appContext.pubSub.publish('user_authenticated', { token });
        expect(appContext.authenticatedHTTPClient.token).toEqual(token);
      });
    });
  });
});
