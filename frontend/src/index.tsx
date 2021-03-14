import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from './app/AppContext';
import { AppProvider } from './app/AppReactContext';
import { App } from './app/ui/App';
import { AuthenticationProvider } from './authentication/AuthenticationReactContext';
import './i18n';
import * as serviceWorker from './serviceWorker';
import './shared/ui/components/helpers.css';

const appContext = new AppContext();
appContext.startSubscribers();

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
