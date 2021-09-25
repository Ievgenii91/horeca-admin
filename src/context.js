import React from 'react';
export const envVars = {
  authDomain: 'dev-jjc0qxdi.eu.auth0.com', // TODO think to use own auth
  authClientId: 'NJsxplAtp8J6oTiSjtrWhpo1VIr7GiGZ',
  authAudience: 'https://bilyynalyv.herokuapp.com/permissions',
  s3: 'https://horeca-bucket.s3.eu-central-1.amazonaws.com',
  // apiServer: 'https://nestbn.herokuapp.com'
  apiServer: 'http://localhost:8080'
};
window.config = envVars;
export const EnvironmentContext = React.createContext(envVars);