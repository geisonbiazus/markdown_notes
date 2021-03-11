import { StateObservableInteractor } from '../../utils/StateObservableInteractor';
import { AuthenticationClient } from '../entities';

export interface ActivateUserState {
  status: 'idle' | 'pending' | 'activated' | 'not_found';
}

export class ActivateUserInteractor extends StateObservableInteractor<ActivateUserState> {
  constructor(private client: AuthenticationClient) {
    super({ status: 'idle' });
  }

  public async activate(token: String): Promise<void> {
    this.updateState({ status: 'pending' });

    const response = await this.client.activateUser(token);

    if (response.status === 'success') {
      this.updateState({ status: 'activated' });
    } else {
      this.updateState({ status: 'not_found' });
    }
  }
}
