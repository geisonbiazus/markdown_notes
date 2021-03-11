import React from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAuthenticationContext } from '../../authentication/AuthenticationReactContext';
import { NoteProvider } from '../../notes/NoteReactContext';
import { EditNote } from '../../notes/ui/EditNote';
import { NoteList } from '../../notes/ui/NoteList';
import { ShowNote } from '../../notes/ui/ShowNote';
import { Button } from '../../shared/components/Button';
import { AppBar, AppContainer, Col, Row } from '../../shared/components/Layout';

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
            <Route exact path="/notes/:id" component={ShowNote} />
            <Route exact path="/notes/:id/edit" component={EditNote} />
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
