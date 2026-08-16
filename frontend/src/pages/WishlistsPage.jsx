import React, { useState, useEffect, useContext } from 'react';
import { Trash2, ShoppingCart, Plus, ListCollapse } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const WishlistsPage = () => {
  const [lists, setLists] = useState({
    'My Wishlist': [],
  });
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState('My Wishlist');
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const stored = localStorage.getItem('plmnermart_wishlists');
    if (stored) {
      setLists(JSON.parse(stored));
    }
  }, []);

  const saveLists = (updated) => {
    setLists(updated);
    localStorage.setItem('plmnermart_wishlists', JSON.stringify(updated));
  };

  const createListHandler = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const name = newListName.trim();
    if (lists[name]) {
      alert('List already exists!');
      return;
    }
    const updated = {
      ...lists,
      [name]: [],
    };
    saveLists(updated);
    setSelectedList(name);
    setNewListName('');
  };

  const deleteListHandler = (name) => {
    if (name === 'My Wishlist') {
      alert('Default wishlist cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the list "${name}"?`)) {
      const updated = { ...lists };
      delete updated[name];
      saveLists(updated);
      setSelectedList('My Wishlist');
    }
  };

  const removeItemHandler = (listName, itemId) => {
    const updated = { ...lists };
    updated[listName] = updated[listName].filter((item) => item._id !== itemId);
    saveLists(updated);
  };

  const moveToCartHandler = (item) => {
    addToCart(item, 1);
    removeItemHandler(selectedList, item._id);
    alert('Item moved to cart!');
  };

  const currentListItems = lists[selectedList] || [];

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ListCollapse size={28} color="#f90" /> Your Registry & Shopping Lists
      </h1>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Lists directories */}
        <div style={{ width: '280px', backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>Manage Lists</h3>
          
          <form onSubmit={createListHandler} style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Create a list..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              style={{ padding: '0.4rem' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
              <Plus size={16} />
            </button>
          </form>

          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.keys(lists).map((name) => (
              <li
                key={name}
                onClick={() => setSelectedList(name)}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--border-radius-sm)',
                  cursor: 'pointer',
                  fontWeight: selectedList === name ? '700' : '500',
                  backgroundColor: selectedList === name ? '#f3f4f6' : 'transparent',
                  color: selectedList === name ? 'var(--secondary)' : 'var(--text-dark)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{name} ({lists[name].length})</span>
                {name !== 'My Wishlist' && (
                  <Trash2
                    size={14}
                    color="var(--danger)"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteListHandler(name);
                    }}
                    style={{ opacity: 0.7, cursor: 'pointer' }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: List details */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: '700', fontSize: '1.3rem' }}>{selectedList} Items</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{currentListItems.length} items saved</span>
          </div>

          {currentListItems.length === 0 ? (
            <div className="alert alert-info">
              This list is empty. Add products to lists while browsing the shop catalog.
              <div style={{ marginTop: '1rem' }}>
                <Link to="/" className="btn btn-primary">Go Shopping</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {currentListItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    backgroundColor: 'var(--bg-card)',
                    padding: '1.2rem',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--border-color)',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item._id}`} style={{ fontWeight: '700', color: 'var(--text-dark)', textDecoration: 'none', fontSize: '1rem' }}>
                      {item.name}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Brand: {item.brand} | Category: {item.category}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--secondary)', marginTop: '0.4rem' }}>
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '150px' }}>
                    <button
                      onClick={() => moveToCartHandler(item)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeItemHandler(selectedList, item._id)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', border: '1px solid var(--border-color)' }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WishlistsPage;
