import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import { FaListOl, FaWarehouse, FaLayerGroup, FaChartBar, FaUsers, FaRegClock } from 'react-icons/fa';

export default function Header({ hide }) {
  return (
    <>
      <nav className="nav nav-pills nav-justified">
        {!hide && (
          <>
            <div className="nav-item m-3">
              <Link to="/">
                <FaWarehouse size={24} />
              </Link>
            </div>
            {/* <div className="nav-item m-3">
              <Link to="/orders">
                <FaListOl size={24} />
              </Link>
            </div> */}
            <div className="nav-item m-3">
              <Link to="/categories">
                <FaLayerGroup size={24} />
              </Link>
            </div>
            {/* <div className="nav-item m-3">
              <Link to="/stats">
                <FaChartBar size={24} />
              </Link>
            </div> */}
            <div className="nav-item m-3">
              <Link to="/users">
                <FaUsers size={24} />
              </Link>
            </div>
            <div className="nav-item m-3">
              <Link to="/timetracking">
                <FaRegClock size={24} />
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
