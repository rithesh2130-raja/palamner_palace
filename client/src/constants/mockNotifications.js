export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Order Status Updated',
    message: 'Your order #PP-94827 for Palamner Silk Saree has been dispatched!',
    timestamp: '10 minutes ago',
    read: false,
    type: 'order',
    icon: 'PackageCheck'
  },
  {
    id: 'notif-2',
    title: 'Price Drop Alert! 📉',
    message: 'Wireless ANC Headphones in your wishlist is now 30% OFF.',
    timestamp: '2 hours ago',
    read: false,
    type: 'wishlist',
    icon: 'Tag'
  },
  {
    id: 'notif-3',
    title: 'New Reel Recommendation 🎬',
    message: 'Ananya Sharma tagged a product in a new Palamner Silk Saree video reel.',
    timestamp: 'Yesterday',
    read: true,
    type: 'reel',
    icon: 'Film'
  },
  {
    id: 'notif-4',
    title: 'Welcome to PalamnerPalace! 🎉',
    message: 'Enjoy free delivery on your first order with code PALACEFIRST.',
    timestamp: '2 days ago',
    read: true,
    type: 'system',
    icon: 'Sparkles'
  }
];
