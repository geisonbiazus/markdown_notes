import { AuthenticationInteractor } from './AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  describe('authenticate', () => {
    it('Given no user exists for the email, it returns error', () => {
      const interactor = new AuthenticationInteractor();
      const email = 'user@example.com';
      const password = 'password';

      const response = interactor.authenticate(email, password);

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    // it('Given a user exists but the wrong password is provider, it returns error', () => {
    //   const repository = new InMemoryAuthenticationRepository();
    //   const interactor = new AuthenticationInteractor();
    //   const email = 'user@example.com';
    //   const password = 'password';

    //   const response = interactor.authenticate(email, password);

    //   expect(response).toEqual({ status: 'error', type: 'not_found' });
    // });
  });
});
