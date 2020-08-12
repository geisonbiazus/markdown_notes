import React from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { EditNote } from './notes';
import { uuid } from './utils';
import { Container, Row, Col, Button } from './shared/components';

function App() {
  const history = useHistory();

  const newNote = () => {
    history.push(`/notes/${uuid()}`);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Link to="/">Home</Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={newNote}>
            New Note
          </Button>
        </Col>
      </Row>

      <Switch>
        <Route exact path="/notes/:id" component={EditNote} />
        <Route exact path="/">
          Home
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
