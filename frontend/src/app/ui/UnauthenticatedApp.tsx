import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SignIn, SignUp } from '../../authentication';
import { Row, Col, AppBar, AppContainer } from '../../shared/components';

export const UnauthenticatedApp: React.FC = () => (
  <>
    <AppBar title="MarkdownNotes" href="/" />
    <AppContainer>
      <Row>
        <Col>
          <Switch>
            <Route exact path="/sign_in" component={SignIn} />
            <Route exact path="/sign_up" component={SignUp} />
            <Route path="/">
              <Redirect to="/sign_in" />
            </Route>
          </Switch>
        </Col>
      </Row>
    </AppContainer>
  </>
);
