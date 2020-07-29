import React from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { EditNote } from './notes';
import { uuid } from './utils';

function App() {
  const history = useHistory();

  const newNote = () => {
    history.push(`/notes/${uuid()}`);
  };

  return (
    <>
      <p>
        <Link to="/">Home</Link>
      </p>
      <p>
        <button type="button" onClick={newNote}>
          New Note
        </button>
      </p>

      <Switch>
        <Route exact path="/notes/:id" component={EditNote} />
        <Route exact path="/">
          Home
        </Route>
      </Switch>
    </>
  );
}

export default App;
