export const USER_AUTHENTICATED_EVENT = 'user_authenticated';
export const USER_SIGNED_UP_EVENT = 'user_signed_up';

export interface UserAuthenticatedPayload {
  token: string;
}

export interface UserSignedUpPayload {
  name: string;
  email: string;
}
