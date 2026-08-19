import React, { useState } from 'react';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../constants/mockProducts.js';

export const OrdersPage = () => {
  const [orders] = useState([
    {
      id: 'PP-ORD-98421',
      date: 'Aug 14, 2026',
      status: 'Delivered',
      statusColor: 'emerald',
      total: 3499,
      items: [
        { product: MOCK_PRODUCTS[0], quantity: 1 }
      ]
    },
    {
      id: 'PP-ORD-98210',
      date: 'Aug 02, 2026',
      status: 'In Transit',
      statusColor: 'amber',
      total: 3698,
      items: [
        { product: MOCK_PRODUCTS[1], quantity: 1 },
        { product: MOCK_PRODUCTS[2], quantity: 1 }
      ]
    }
  ]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-[#E50914]" />
            <span>My Orders & Tracking</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">View your order history, delivery tracking, and invoice details.</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-neutral-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{order.id}</span>
                    <span className="text-neutral-500">• Placed on {order.date}</span>
                  </div>
                  <div className="text-neutral-600">Total: <span className="font-bold text-black">₹{order.total.toLocaleString('en-IN')}</span></div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    order.statusColor === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {order.statusColor === 'emerald' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Truck className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{order.status}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-14 h-14 rounded-xl object-cover border border-neutral-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-black">{product.title}</h4>
                        <p className="text-[11px] text-neutral-500">Qty: {quantity} • ₹{product.price.toLocaleString('en-IN')} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
