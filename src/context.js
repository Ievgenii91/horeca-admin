import React from 'react';

export const envVars = {
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  authClientId: process.env.REACT_APP_AUTH_CLIENT_ID,
  authAudience: process.env.REACT_APP_AUTH_AUDIENCE,
  s3: process.env.REACT_APP_S3,
  apiServer: process.env.REACT_APP_API_SERVER,
};
window.config = envVars;
export const EnvironmentContext = React.createContext(envVars);