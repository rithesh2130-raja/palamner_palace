import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { getProducts, deleteProduct, updateProduct } from '../../../services/productService';
import { Product, ProductPagination } from '../../../types/product';
import { TableSkeleton } from '../../../components/ui/Skeletons.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ProductPagination>({ page: 1, limit: 20, total: 0, pages: 1 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminProducts();
  }, [page, category]);

  const fetchAdminProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = { page, limit: 20 };
      if (category) filters.category = category;
      if (search) filters.search = search;

      const res = await getProducts(filters);
      if (res && res.success && res.data) {
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
      }
    } catch (err: any) {
      console.error('Failed to load admin products:', err);
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAdminProducts();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await deleteProduct(id);
      if (res && res.success) {
        if (showToast) showToast(`Product "${name}" deleted`, 'info');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err: any) {
      if (showToast) showToast(`Failed to delete: ${err.message}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const newStatus = !product.isActive;
    try {
      const res = await updateProduct(product._id, { isActive: newStatus });
      if (res && res.success) {
        if (showToast) showToast(`Product status updated to ${newStatus ? 'Active' : 'Inactive'}`, 'success');
        setProducts(
          products.map((p) => (p._id === product._id ? { ...p, isActive: newStatus } : p))
        );
      }
    } catch (err: any) {
      if (showToast) showToast(`Failed to update status: ${err.message}`, 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Create, modify, activate, or archive inventory items across ShopSphere.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-hover shadow-md shadow-brand-primary/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 border border-border rounded-xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, brand..."
            className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs font-bold text-text-primary focus:outline-none focus:border-brand-primary"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Home">Home</option>
            <option value="Gaming">Gaming</option>
            <option value="Sports">Sports</option>
          </select>

          <button
            onClick={fetchAdminProducts}
            className="p-2 border border-border rounded-lg bg-surface-secondary text-text-muted hover:text-text-primary"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Admin Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <div className="p-8 bg-status-danger/10 border border-status-danger/30 rounded-xl text-center">
          <AlertCircle className="w-8 h-8 text-status-danger mx-auto mb-2" />
          <p className="text-sm font-bold text-text-primary">{error}</p>
          <button
            onClick={fetchAdminProducts}
            className="mt-4 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products in catalog"
          description="Click 'Add Product' to list your first item in MongoDB."
          actionLabel="Add Product"
          onAction={() => navigate('/admin/products/new')}
        />
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-border text-[11px] font-black uppercase text-text-muted tracking-wider">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {products.map((prod) => {
                  const img = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                  return (
                    <tr key={prod._id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={img}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                        />
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-text-primary line-clamp-1">{prod.name}</div>
                        <div className="text-[11px] text-text-muted flex items-center gap-2">
                          <span>{prod.brand}</span>
                          <span>•</span>
                          <span className="text-brand-primary">{prod.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-text-secondary">{prod.sku}</td>
                      <td className="py-3 px-4 font-bold text-text-primary">
                        ₹{prod.price.toLocaleString('en-IN')}
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <span className="block text-[10px] text-text-muted line-through font-normal">
                            ₹{prod.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span className={prod.stock > 0 ? 'text-emerald-600 font-bold' : 'text-status-danger font-bold'}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(prod)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            prod.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-500/10 text-text-muted'
                          }`}
                        >
                          {prod.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/products/${prod.slug || prod._id}`}
                          target="_blank"
                          className="inline-p-1.5 text-text-muted hover:text-text-primary transition-colors"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </Link>
                        <Link
                          to={`/admin/products/${prod._id}/edit`}
                          className="inline-p-1.5 text-brand-primary hover:text-brand-primary-hover transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod._id, prod.name)}
                          disabled={deletingId === prod._id}
                          className="p-1 text-status-danger hover:text-red-700 transition-colors disabled:opacity-30"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 bg-surface-secondary border-t border-border flex items-center justify-between text-xs">
              <span className="text-text-muted">
                Showing page {pagination.page} of {pagination.pages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1 bg-surface border border-border rounded text-text-primary disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                  className="px-3 py-1 bg-surface border border-border rounded text-text-primary disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
