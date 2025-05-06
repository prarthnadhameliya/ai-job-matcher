import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">JobMatch</Link>
        </div>
        
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              <span className="nav-icon">🏠</span>
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className={isActive('/jobs') ? 'active' : ''}>
              <span className="nav-icon">💼</span>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/upload" className={isActive('/upload') ? 'active' : ''}>
              <span className="nav-icon">📤</span>
              Upload Resume
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
