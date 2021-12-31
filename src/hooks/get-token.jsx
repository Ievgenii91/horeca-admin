import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useGetToken = () => {
  let { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        let t = await getAccessTokenSilently();
        setToken(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  return token;
};
