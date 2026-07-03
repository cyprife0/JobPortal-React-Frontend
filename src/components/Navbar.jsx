import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          💼 Job<span>Portal</span>
        </Link>
        <div className="nav-links">
          <Link to="/">🏠 Home</Link>
          <Link to="/create">➕ Add Job</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;