import { StateObservableStore } from '../../shared/stores/StateObservableStore';
import { AuthenticationClient } from '../ports/AuthenticationClient';

export interface ActivateUserState {
  status: 'idle' | 'pending' | 'activated' | 'not_found';
}

export class ActivateUserStore extends StateObservableStore<ActivateUserState> {
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
