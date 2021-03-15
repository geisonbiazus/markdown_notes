import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { CenteredContainer } from '../../shared/ui/components/Layout';
import { Loading } from '../../shared/ui/components/Loading';
import { useAuthenticationContext } from '../AuthenticationReactContext';

export const ActivateUser: React.FC = () => {
  const { activateUserState, activateUserStore } = useAuthenticationContext();
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    activateUserStore.activate(token);
    return activateUserStore.cleanUp;
  }, [activateUserStore, token]);

  switch (activateUserState.status) {
    case 'activated':
      return <ActivateUserSuccess />;
    case 'not_found':
      return <ActivateUserNotFound />;
    default:
      return <Loading />;
  }
};

const ActivateUserNotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CenteredContainer>
      <div className="margin-top-5">
        <h1>{t('Invalid URL!')}</h1>
        <p className="margin-top-2">
          {t('The provided URL is invalid, expired, or your user is already active.')}
        </p>
        <p>
          <Trans i18nKey="activateUserNotFoundSignUpSignUpLink">
            Please proceed to <Link to="/sign_in">sign in</Link> or{' '}
            <Link to="/sign_in">sign up</Link> with a new account.
          </Trans>
        </p>
      </div>
    </CenteredContainer>
  );
};

const ActivateUserSuccess: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CenteredContainer>
      <div className="margin-top-5">
        <h1>{t('User activated!')}</h1>
        <p className="margin-top-2">{t('Your user is active and your account is ready.')}</p>
        <p>
          <Trans i18nKey="activateUserSuccessSignInLink">
            Please proceed to <Link to="/sign_in">sign in</Link>.
          </Trans>
        </p>
      </div>
    </CenteredContainer>
  );
};
