import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { SignIn } from '../authentication/ui';
import { Row, Col, AppBar, AppContainer } from '../shared/components';

export const UnauthenticatedApp: React.FC = () => (
  <>
    <AppBar title="MarkdownNotes" href="/" />
    <AppContainer>
      <Row>
        <Col>
          <Switch>
            <Route exact path="/sign_in" component={SignIn} />
            <Route exact path="/">
              Home
            </Route>
          </Switch>
        </Col>
      </Row>
    </AppContainer>
  </>
);
