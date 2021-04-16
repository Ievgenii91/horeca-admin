import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import { Provider } from 'react-redux';
import store from './stores';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Wrapper from './auth/Wrapper';

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname,
  );
};

ReactDOM.render(
  <Auth0Provider
    domain="dev-jjc0qxdi.eu.auth0.com"
    clientId="NJsxplAtp8J6oTiSjtrWhpo1VIr7GiGZ"
    audience="https://bilyynalyv.herokuapp.com/permissions"
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <Wrapper>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Wrapper>
  </Auth0Provider>,
  document.getElementById('root'),
);
