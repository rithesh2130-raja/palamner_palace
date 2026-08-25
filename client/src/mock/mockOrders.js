export const mockOrders = [
  {
    id: 'ord-1001',
    orderNumber: 'SHP-984321',
    date: '2026-08-24',
    totalAmount: 4798,
    status: 'Delivered',
    itemsCount: 2,
    items: [
      { id: 'item-1', title: 'Wireless Noise-Canceling Gaming Headset Pro X', price: 1499, quantity: 1 },
      { id: 'item-2', title: 'Ergonomic RGB Mechanical Keyboard', price: 3299, quantity: 1 },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'SHP-984322',
    date: '2026-08-22',
    totalAmount: 1899,
    status: 'In Transit',
    itemsCount: 1,
    items: [
      { id: 'item-3', title: 'Minimalist Leather Crossbody Bag', price: 1899, quantity: 1 },
    ],
  },
  {
    id: 'ord-1003',
    orderNumber: 'SHP-984323',
    date: '2026-08-20',
    totalAmount: 2999,
    status: 'Processing',
    itemsCount: 1,
    items: [
      { id: 'item-4', title: 'Smartwatch Fitness Tracker', price: 2999, quantity: 1 },
    ],
  },
  {
    id: 'ord-1004',
    orderNumber: 'SHP-984324',
    date: '2026-08-15',
    totalAmount: 749,
    status: 'Delivered',
    itemsCount: 1,
    items: [
      { id: 'item-5', title: 'Organic Hydrating Facial Serum', price: 749, quantity: 1 },
    ],
  },
  {
    id: 'ord-1005',
    orderNumber: 'SHP-984325',
    date: '2026-08-10',
    totalAmount: 899,
    status: 'Cancelled',
    itemsCount: 1,
    items: [
      { id: 'item-6', title: 'Aromatherapy Essential Oil Diffuser', price: 899, quantity: 1 },
    ],
  }
];

export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Order Delivered 🎉',
    message: 'Your order SHP-984321 has been successfully delivered.',
    timestamp: '2 hours ago',
    read: false,
    type: 'order',
  },
  {
    id: 'notif-2',
    title: 'Price Drop Alert 🏷️',
    message: 'Wireless Noise-Canceling Gaming Headset Pro X is now 40% OFF!',
    timestamp: '5 hours ago',
    read: false,
    type: 'deal',
  },
  {
    id: 'notif-3',
    title: 'New Reel from Alex Tech',
    message: 'alex_tech_reviews posted a new video sound test.',
    timestamp: '1 day ago',
    read: true,
    type: 'social',
  },
  {
    id: 'notif-4',
    title: 'Flash Sale Live Now 🔥',
    message: 'Extra 15% OFF on Electronics using code SHOPSPHERE15',
    timestamp: '2 days ago',
    read: true,
    type: 'promo',
  },
  {
    id: 'notif-5',
    title: 'System Security Notice',
    message: 'Your password was updated successfully.',
    timestamp: '3 days ago',
    read: true,
    type: 'system',
  }
];

export const mockCategories = [
  { id: 'cat-1', name: 'Electronics', icon: 'Tv', count: 1420 },
  { id: 'cat-2', name: 'Fashion', icon: 'Shirt', count: 980 },
  { id: 'cat-3', name: 'Home', icon: 'Home', count: 650 },
  { id: 'cat-4', name: 'Gaming', icon: 'Gamepad2', count: 830 },
  { id: 'cat-5', name: 'Beauty', icon: 'Sparkles', count: 520 },
  { id: 'cat-6', name: 'Deals', icon: 'Tag', count: 310 },
];
