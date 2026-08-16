import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, ChevronDown, LogOut, MapPin, Menu, HelpCircle, Globe } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { userInfo, logout } = useContext(UserContext);
  const { cartItems } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [locationMock, setLocationMock] = useState('New York, USA');
  
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/';
    const params = [];
    if (keyword.trim()) params.push(`search=${keyword}`);
    if (category !== 'All') params.push(`category=${category}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    navigate(url);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' });
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const changeLocationMock = () => {
    const locs = ['New York, USA', 'London, UK', 'New Delhi, IN', 'Tokyo, JP', 'Berlin, DE'];
    const nextLoc = locs[(locs.indexOf(locationMock) + 1) % locs.length];
    setLocationMock(nextLoc);
    alert(`Delivery address updated to: ${nextLoc}`);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header style={{ display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, zIndex: 1000, width: '100%', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      
      {/* Desktop Header Row (64px) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: '#131A22',
        color: '#ffffff',
        height: '64px',
        gap: '20px'
      }}>
        
        {/* Logo and Deliver Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', textDecoration: 'none', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center' }}>
            Shop<span style={{ color: '#FFB000' }}>Sphere</span>
          </Link>
          
          {/* Deliver Location Widget */}
          <div onClick={changeLocationMock} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <MapPin size={18} color="#FFB000" />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>Deliver to</span>
              <span style={{ fontSize: '13px', fontWeight: '700' }}>{locationMock}</span>
            </div>
          </div>
        </div>

        {/* Search Bar with Category Selection (Height 42px) */}
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          flex: 1,
          maxWidth: '700px',
          height: '42px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '0 12px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              fontSize: '13px',
              color: '#374151',
              cursor: 'pointer',
              borderRight: '1px solid #d1d5db',
              outline: 'none',
            }}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
          </select>
          <input
            type="text"
            placeholder="Search ShopSphere products..."
            style={{
              flex: 1,
              padding: '0 16px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#111827'
            }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" style={{
            width: '44px',
            backgroundColor: '#FFB000',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 150ms',
          }}>
            <Search size={18} color="#111827" />
          </button>
        </form>

        {/* Navigation Action Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
            <Globe size={16} color="#FFB000" />
            <span>EN</span>
            <ChevronDown size={12} color="#9ca3af" />
          </div>

          {/* Account Profile drop menu */}
          {userInfo ? (
            <div className="dropdown" style={{ position: 'relative' }}>
              <div className="nav-item" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Hello, {userInfo.name}</span>
                <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center' }}>
                  Account & Lists <ChevronDown size={14} />
                </span>
              </div>
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">My Profile</Link>
                <Link to="/wishlist" className="dropdown-item">My Wishlist</Link>
                <div className="dropdown-divider"></div>
                <button
                  onClick={handleLogout}
                  className="dropdown-item"
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    width: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--danger)',
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>Hello, sign in</span>
              <span style={{ fontWeight: '700' }}>Account & Lists</span>
            </Link>
          )}

          {/* Orders Link */}
          <Link to="/orders" style={{ color: '#fff', textDecoration: 'none', display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>Returns</span>
            <span style={{ fontWeight: '700' }}>& Orders</span>
          </Link>

          {/* Cart Widget */}
          <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="cart-count" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#FFB000',
                  color: '#111827',
                  fontSize: '11px',
                  fontWeight: '700',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            <span style={{ fontWeight: '700', fontSize: '14px' }}>Cart</span>
          </Link>

          {/* Admin link portal */}
          {userInfo && userInfo.isAdmin && (
            <div className="dropdown" style={{ position: 'relative' }}>
              <div className="nav-item" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Manage</span>
                <span style={{ fontWeight: '700', color: '#FFB000', display: 'flex', alignItems: 'center' }}>
                  Admin Panel <ChevronDown size={14} />
                </span>
              </div>
              <div className="dropdown-menu">
                <Link to="/admin/dashboard" className="dropdown-item">Dashboard</Link>
                <Link to="/admin/productlist" className="dropdown-item">Products</Link>
                <Link to="/admin/orderlist" className="dropdown-item">Orders</Link>
                <Link to="/admin/userlist" className="dropdown-item">Users</Link>
              </div>
            </div>
          )}

        </nav>
      </div>

      {/* Secondary Navigation Row (42px) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: '#232F3E',
        color: '#ffffff',
        fontSize: '13px',
        height: '42px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', cursor: 'pointer' }}>
            <Menu size={16} /> All
          </div>
          <Link to="/deals" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Deals</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Best Sellers</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>New Releases</Link>
          <Link to="/?category=Electronics" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Electronics</Link>
          <Link to="/?category=Accessories" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Accessories</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Grocery</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Sports</Link>
          <Link to="/help" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={14} /> Customer Service
          </Link>
        </div>
        <div style={{ fontWeight: '700', color: '#FFB000' }}>
          ShopSphere Prime Delivery Active
        </div>
      </div>
    </header>
  );
};

export default Header;
