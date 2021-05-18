import React from 'react';
export const envVars = {
  uploadCarePublicKey: '6f6c60b9958aca9bb717',
  authDomain: 'dev-jjc0qxdi.eu.auth0.com',
  authClientId: 'NJsxplAtp8J6oTiSjtrWhpo1VIr7GiGZ',
  authAudience: 'https://bilyynalyv.herokuapp.com/permissions',
  apiServer: 'https://nestbn.herokuapp.com'
  // apiServer: 'http://localhost:8080'
};
window.config = envVars;
export const EnvironmentContext = React.createContext(envVars);