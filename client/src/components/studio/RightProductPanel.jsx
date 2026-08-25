import React, { useState } from 'react';
import { ShoppingBag, Tag, Check, Star, RefreshCw, ShoppingCart, Eye } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';
import { mockProducts } from '../../mock/index.js';

export const RightProductPanel = () => {
  const { selectedProduct, setSelectedProduct, selectedCTA, setSelectedCTA } = useAIStudioStore();
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const ctaOptions = ['Shop Now', 'Buy Now', 'View Product', 'Add to Cart'];

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 bg-surface border border-border rounded-2xl shadow-xs overflow-y-auto">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-text-primary uppercase tracking-wide">
            PRODUCT COMMERCE
          </h2>
        </div>
        <Badge variant="verified" size="sm">Tagged</Badge>
      </div>

      {/* Selected Product Card */}
      {selectedProduct ? (
        <Card variant="outlined" className="p-4 space-y-3 bg-surface-secondary/40">
          <div className="flex items-start gap-3">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="w-16 h-16 rounded-lg object-cover border border-border shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {selectedProduct.brand}
              </span>
              <h3 className="font-bold text-xs text-text-primary line-clamp-2 mt-0.5">
                {selectedProduct.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-extrabold text-accent">
                  ₹{selectedProduct.price?.toLocaleString()}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-xs text-text-muted line-through">
                    ₹{selectedProduct.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{selectedProduct.rating || 4.8}</span>
              <span className="text-text-muted text-[10px]">({selectedProduct.reviewCount || 120})</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              In Stock & Ready
            </span>
          </div>
        </Card>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border text-center text-text-muted text-xs">
          No product selected. Choose a product to create a shoppable Reel.
        </div>
      )}

      {/* Product Tagging Status */}
      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Product will be automatically tagged in final Reel</span>
      </div>

      {/* CTA Selector Options */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Overlay CTA Button Text
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ctaOptions.map((option) => {
            const isSelected = selectedCTA === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedCTA(option)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                  isSelected
                    ? 'border-accent bg-accent text-gray-950 shadow-xs'
                    : 'border-border bg-surface-secondary hover:border-text-muted text-text-primary'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Change Product Button */}
      <Button
        variant="outline"
        size="md"
        fullWidth
        icon={RefreshCw}
        onClick={() => setIsSelectModalOpen(true)}
        className="mt-2 text-xs font-bold"
      >
        Select Different Product
      </Button>

      {/* Product Selector Modal */}
      <Modal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        title="Select Commerce Product"
        description="Choose a product from your catalog to feature in this AI Reel"
      >
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {mockProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                setSelectedProduct(prod);
                setIsSelectModalOpen(false);
              }}
              className="p-3 rounded-xl border border-border hover:border-accent bg-surface-secondary/50 flex items-center gap-3 cursor-pointer transition-all group"
            >
              <img src={prod.image} alt={prod.title} className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-text-muted uppercase">{prod.brand}</span>
                <h4 className="text-xs font-bold text-text-primary truncate group-hover:text-accent">{prod.title}</h4>
                <span className="text-xs font-extrabold text-accent">₹{prod.price.toLocaleString()}</span>
              </div>
              <Button size="sm" variant="primary" className="shrink-0 text-xs font-bold">
                Select
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default RightProductPanel;
