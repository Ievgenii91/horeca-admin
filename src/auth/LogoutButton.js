import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaSignOutAlt } from 'react-icons/fa';

function LogoutButton() {
  const { isAuthenticated, logout } = useAuth0();

  return (
    isAuthenticated && (
      <FaSignOutAlt
        size={32}
        onClick={() => {
          logout({ returnTo: `${window.location.origin}/logout` });
        }}
      />
    )
  );
}

export default LogoutButton;
