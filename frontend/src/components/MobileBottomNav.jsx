import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Video, PlusCircle, ShoppingCart, User } from 'lucide-react';

const MobileBottomNav = () => {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#131A22',
      borderTop: '1px solid #232F3E',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 -4px 15px rgba(0,0,0,0.3)',
    }}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? '#FFB000' : '#9ca3af',
          fontSize: '0.7rem',
          fontWeight: '700',
          textDecoration: 'none',
        })}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/reels"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? '#FFB000' : '#ffffff',
          fontSize: '0.7rem',
          fontWeight: '800',
          textDecoration: 'none',
        })}
      >
        <div style={{ position: 'relative' }}>
          <Video size={22} color={window.location.pathname === '/reels' ? '#FFB000' : '#FFB000'} />
          <span style={{ position: 'absolute', top: -3, right: -6, width: '8px', height: '8px', backgroundColor: '#f43f5e', borderRadius: '50%' }}></span>
        </div>
        <span>Reels</span>
      </NavLink>

      <NavLink
        to="/creator/create"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? '#FFB000' : '#9ca3af',
          fontSize: '0.7rem',
          fontWeight: '700',
          textDecoration: 'none',
        })}
      >
        <PlusCircle size={22} color="#FFB000" />
        <span>Create</span>
      </NavLink>

      <NavLink
        to="/cart"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? '#FFB000' : '#9ca3af',
          fontSize: '0.7rem',
          fontWeight: '700',
          textDecoration: 'none',
        })}
      >
        <ShoppingCart size={20} />
        <span>Cart</span>
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? '#FFB000' : '#9ca3af',
          fontSize: '0.7rem',
          fontWeight: '700',
          textDecoration: 'none',
        })}
      >
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
