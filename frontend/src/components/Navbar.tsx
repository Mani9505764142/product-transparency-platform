import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo" onClick={() => navigate('/')}>
          Product Transparency
        </h1>
        
        <div className="navbar-menu">
          <button onClick={() => navigate('/')} className="navbar-link">
            ➕ Add Product
          </button>
          <button onClick={() => navigate('/products')} className="navbar-link">
            📋 View All Products
          </button>
          <span className="navbar-user">{user.email}</span>
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
