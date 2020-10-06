import { InteractorResponse } from '../../notes';

export class AuthenticationInteractor {
  authenticate(email: string, password: string): InteractorResponse {
    return InteractorResponse.notFound();
  }
}
