import mongoose from 'mongoose';

export function getHealthStatus(req, res) {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    message: 'ShopSphere API is running',
    timestamp: new Date().toISOString(),
    data: {
      backend: 'Connected',
      database: isDbConnected ? 'Connected' : 'Disconnected',
    },
  });
}
