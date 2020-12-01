import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './i18n';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { App, AppContext, AppProvider } from './app';
import { AuthenticationProvider } from './authentication';

const appContext = new AppContext();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider appContext={appContext}>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
