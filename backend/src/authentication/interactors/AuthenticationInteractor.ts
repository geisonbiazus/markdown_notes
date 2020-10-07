import { InteractorResponse } from '../../notes';

export interface AuthenticationRepository {}

export class AuthenticationInteractor {
  constructor(private repository: AuthenticationRepository) {}

  async authenticate(email: string, password: string): Promise<InteractorResponse> {
    return InteractorResponse.notFound();
  }
}
