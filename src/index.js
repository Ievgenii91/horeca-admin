import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './stores';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Wrapper from './auth/Wrapper';
import { EnvironmentContext, envVars } from './context';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname,
  );
};

ReactDOM.render(
  <EnvironmentContext.Provider value={envVars}>
    <Auth0Provider
      domain={envVars.authDomain}
      clientId={envVars.authClientId}
      audience={envVars.authAudience}
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
    </Auth0Provider>
  </EnvironmentContext.Provider>,
  document.getElementById('root'),
);

serviceWorkerRegistration.register();