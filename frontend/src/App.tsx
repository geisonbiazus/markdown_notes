import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { EditNote, NoteList } from './notes';
import { Container, Row, Col } from './shared/components';

function App() {
  return (
    <Container fluid>
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
    </Container>
  );
}

export default App;
