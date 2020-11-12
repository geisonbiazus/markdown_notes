import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useAuthenticationContext } from '../authentication';
import { EditNote, NoteList, NoteProvider } from '../notes';
import { Row, Col, AppBar, AppContainer, Button } from '../shared/components';

export const AuthenticatedApp: React.FC = () => (
  <NoteProvider>
    <AuthenticatedAppBar />
    <AppContainer>
      <Row>
        <Col xs={2}>
          <NoteList />
        </Col>
        <Col>
          <Switch>
            <Route exact path="/notes/:id" component={EditNote} />
            <Route path="/sign_in">
              <Redirect to="/" />
            </Route>
            <Route exact path="/">
              Home
            </Route>
          </Switch>
        </Col>
      </Row>
    </AppContainer>
  </NoteProvider>
);

export const AuthenticatedAppBar: React.FC = () => {
  const { t } = useTranslation();
  const { signInInteractor } = useAuthenticationContext();

  const signOutButton = (
    <Button variant="link" onClick={signInInteractor.signOut}>
      {t('Sign out')}
    </Button>
  );

  return <AppBar title="MarkdownNotes" href="/" rightComponent={signOutButton} />;
};
