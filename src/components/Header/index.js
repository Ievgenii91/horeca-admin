import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import { FaCogs, FaHome } from 'react-icons/fa';

export default function Header({ hide }) {
  return (
    <>
      <nav className="nav nav-pills nav-justified">
        {!hide && (
          <>
            <div className="nav-item m-3">
              <Link to="/">
                <FaHome size={32} />
              </Link>
            </div>
            <div className="nav-item m-3">
              <Link to="/settings">
                <FaCogs size={32} />
              </Link>
            </div>
          </>
        )}
        <div className="nav-item m-3">
          <Link to="/">
            <LogoutButton />
          </Link>
        </div>
      </nav>
    </>
  );
}
