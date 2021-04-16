import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from '../components/Loader';

function Wrapper({ children }) {
  const { isLoading, error } = useAuth0();
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  return <>{children}</>;
}
export default Wrapper;
