import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ActivateUser } from '../../authentication/ui/ActivateUser';
import { SignIn } from '../../authentication/ui/SignIn';
import { SignUp } from '../../authentication/ui/SignUp';
import { AppBar, AppContainer, Col, Row } from '../../shared/components/Layout';

export const UnauthenticatedApp: React.FC = () => (
  <>
    <AppBar title="MarkdownNotes" href="/" />
    <AppContainer>
      <Row>
        <Col>
          <Switch>
            <Route exact path="/sign_in" component={SignIn} />
            <Route exact path="/sign_up" component={SignUp} />
            <Route exact path="/activate/:token" component={ActivateUser} />
            <Route path="/">
              <Redirect to="/sign_in" />
            </Route>
          </Switch>
        </Col>
      </Row>
    </AppContainer>
  </>
);
