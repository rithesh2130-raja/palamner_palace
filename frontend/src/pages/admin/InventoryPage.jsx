import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Save, AlertTriangle } from 'lucide-react';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [adjustQty, setAdjustQty] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load inventory');
      const data = await res.json();
      setProducts(data);

      // Initialize adjustQty states
      const qtys = {};
      data.forEach((p) => {
        qtys[p._id] = p.countInStock;
      });
      setAdjustQty(qtys);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQtyChange = (id, val) => {
    setAdjustQty((prev) => ({
      ...prev,
      [id]: Math.max(0, Number(val)),
    }));
  };

  const saveQtyHandler = async (product) => {
    const newQty = adjustQty[product._id];
    if (newQty === undefined || newQty === product.countInStock) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          countInStock: newQty,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update stock');

      alert('Stock level updated successfully!');
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Summaries
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.countInStock > 0 && p.countInStock <= p.reorderLevel).length;
  const outOfStockCount = products.filter((p) => p.countInStock === 0).length;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Inventory & Stock Management</h1>

        {/* Inventory metric headers */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '1.2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL SKUs</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>{totalProducts}</h2>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#fef3c7', padding: '1.2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#92400e' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>LOW STOCK SKUs</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>{lowStockCount}</h2>
            </div>
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1, backgroundColor: '#fee2e2', padding: '1.2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid #fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#991b1b' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>OUT OF STOCK</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>{outOfStockCount}</h2>
            </div>
            <AlertTriangle size={24} />
          </div>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>PRODUCT NAME</th>
                  <th>BRAND</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>REORDER VALUE</th>
                  <th>CURRENT STOCK</th>
                  <th>STOCK LEVEL ADJUSTMENT</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isLow = product.countInStock > 0 && product.countInStock <= product.reorderLevel;
                  const isOut = product.countInStock === 0;
                  
                  return (
                    <tr key={product._id}>
                      <td style={{ fontWeight: '500', maxWidth: '300px' }}>
                        <span style={{ fontSize: '0.9rem' }}>{product.name}</span>
                      </td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>
                      <td>
                        {isOut ? (
                          <span className="badge badge-danger">Out of Stock</span>
                        ) : isLow ? (
                          <span className="badge badge-warning">Low Stock</span>
                        ) : (
                          <span className="badge badge-success">Healthy</span>
                        )}
                      </td>
                      <td>{product.reorderLevel} units</td>
                      <td style={{ fontWeight: '700', color: isOut ? 'var(--danger)' : isLow ? 'var(--warning)' : 'inherit' }}>
                        {product.countInStock} units
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: '80px', padding: '0.4rem' }}
                            value={adjustQty[product._id] === undefined ? '' : adjustQty[product._id]}
                            onChange={(e) => handleQtyChange(product._id, e.target.value)}
                          />
                          <button
                            onClick={() => saveQtyHandler(product)}
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            disabled={actionLoading || adjustQty[product._id] === product.countInStock}
                          >
                            <Save size={12} /> Save
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
