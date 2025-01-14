// frontend/src/components/NavBar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; // optional CSS file for styling

function NavBar() {
  return (
    <nav className="navbar">
      {/* Logo or brand name on the left */}
      <div className="navbar-logo">
        <Link to="/home" className="navbar-brand">Sanctuary Space</Link>
      </div>

      {/* Navigation links */}
      <ul className="navbar-links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/community">Community</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;