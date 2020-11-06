import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { EditNote, NoteList, NoteProvider } from '../notes';
import { Row, Col, AppBar, AppContainer } from '../shared/components';

export const AuthenticatedApp: React.FC = () => (
  <NoteProvider>
    <AppBar title="MarkdownNotes" href="/" />
    <AppContainer>
      <Row>
        <Col xs={2}>
          <NoteList />
        </Col>
        <Col>
          <Switch>
            <Route exact path="/notes/:id" component={EditNote} />
            <Route exact path="/">
              Home
            </Route>
          </Switch>
        </Col>
      </Row>
    </AppContainer>
  </NoteProvider>
);
