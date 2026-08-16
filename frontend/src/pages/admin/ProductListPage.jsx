import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setActionLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Delete failed');
        fetchProducts();
      } catch (err) {
        alert(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const createProductHandler = () => {
    navigate('/admin/product/create');
  };

  const toggleActiveHandler = async (product) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          isActive: !product.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update visibility');
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div className="page-header-row">
          <h1 style={{ fontWeight: '700' }}>Products Inventory</h1>
          <button
            onClick={createProductHandler}
            className="btn btn-primary"
            disabled={actionLoading}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ opacity: product.isActive ? 1 : 0.6 }}>
                  <td style={{ fontWeight: '600' }}>{product._id.substring(0, 8)}...</td>
                  <td>{product.name}</td>
                  <td style={{ fontWeight: '600' }}>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    {product.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger" style={{ backgroundColor: '#64748b', color: '#fff' }}>Inactive</span>
                    )}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        onClick={() => toggleActiveHandler(product)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}
                        disabled={actionLoading}
                        title={product.isActive ? 'Mark as Inactive' : 'Mark as Active'}
                      >
                        {product.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        <Edit2 size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="btn btn-danger"
                        disabled={actionLoading}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
