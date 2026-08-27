import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { createProduct } from '../../../services/productService';
import { useToast } from '../../../context/ToastContext.jsx';

export const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand: '',
    category: 'Electronics',
    subcategory: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    sku: '',
    tags: '',
    isFeatured: false,
    isActive: true,
  });

  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const addImageInput = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageInput = (index: number) => {
    if (imageUrls.length <= 1) return;
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.sku) {
      if (showToast) showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        images: imageUrls.filter((url) => url.trim() !== '').map((url) => ({ url: url.trim(), alt: formData.name })),
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0),
      };

      const res = await createProduct(payload);
      if (res && res.success) {
        if (showToast) showToast(`Product "${formData.name}" created successfully!`, 'success');
        navigate('/admin/products');
      }
    } catch (err: any) {
      console.error('Create product error:', err);
      if (showToast) showToast(err.message || 'Failed to create product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 border border-border rounded-lg bg-surface hover:border-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-text-primary" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-text-primary uppercase tracking-tight">Add New Product</h1>
            <p className="text-xs text-text-muted">Enter product specifications to save into MongoDB.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Gaming Mouse"
              required
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. ApexGear"
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs font-bold text-text-primary focus:outline-none focus:border-brand-primary"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Beauty">Beauty</option>
              <option value="Home">Home</option>
              <option value="Gaming">Gaming</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Subcategory</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              placeholder="e.g. Peripherals"
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-text-muted mb-1">Description *</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of features, materials, and benefits..."
            required
            className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1499"
              min="0"
              required
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Compare Price (₹)</label>
            <input
              type="number"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleChange}
              placeholder="1999"
              min="0"
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="42"
              min="0"
              required
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. GM-001"
              required
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="gaming, wireless, mouse"
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Image URLs */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-brand-primary" /> Product Image Public URLs *
            </label>
            <button
              type="button"
              onClick={addImageInput}
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Image URL
            </button>
          </div>

          {imageUrls.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                placeholder="https://cdn.../product.jpg"
                required={idx === 0}
                className="flex-1 px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageInput(idx)}
                  className="p-2 text-status-danger hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-6 pt-2 border-t border-border">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-primary">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="rounded text-brand-primary focus:ring-brand-primary"
            />
            <span>Featured Product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-primary">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded text-brand-primary focus:ring-brand-primary"
            />
            <span>Active in Store</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 bg-surface-secondary border border-border rounded-xl text-xs font-bold text-text-primary hover:border-text-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-hover shadow-md shadow-brand-primary/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
