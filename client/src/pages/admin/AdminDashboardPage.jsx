import React from 'react';
import Card, { CardHeader, CardContent } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import { mockOrders, mockReels } from '../../mock/index.js';
import { DollarSign, ShoppingBag, Users, Video, TrendingUp, Sparkles, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AdminDashboardPage = () => {
  // Static visual KPI stats (Mock Data)
  const kpiStats = [
    { label: 'Total Platform Revenue', value: '₹4,892,400', change: '+14.2%', isPositive: true, icon: DollarSign },
    { label: 'Total Orders Fulfilled', value: '18,420', change: '+8.6%', isPositive: true, icon: ShoppingBag },
    { label: 'Active Customers', value: '64,120', change: '+12.1%', isPositive: true, icon: Users },
    { label: 'Verified Creators', value: '1,280', change: '+24.5%', isPositive: true, icon: Video },
    { label: 'Published Reels', value: '8,940', change: '+19.8%', isPositive: true, icon: Sparkles },
    { label: 'Reel-Attributed Revenue', value: '₹1,942,000', change: '+32.4%', isPositive: true, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">Executive Dashboard</h1>
            <Badge variant="sponsored" size="sm">Static Visual Mock</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time platform overview across commerce sales, creator reel engagements, and operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button variant="primary" size="sm">System Status</Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiStats.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} variant="default" className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-text-muted mb-2">
                <span className="text-xs font-medium">{kpi.label}</span>
                <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-accent">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                  {kpi.value}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span className={`text-xs font-bold ${kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                  <span className="text-[10px] text-text-muted">vs last month</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Mock Analytics Chart Visualizer */}
      <Card variant="default">
        <CardHeader>
          <div>
            <h3 className="font-bold text-base text-text-primary">Revenue vs Reel Conversion Velocity</h3>
            <p className="text-xs text-text-muted">Daily platform GMV compared to creator video engagement</p>
          </div>
          <Badge variant="prime">Daily Trends</Badge>
        </CardHeader>
        <CardContent className="h-64 flex flex-col justify-end gap-2 pt-8">
          <div className="w-full flex items-end justify-between gap-2 h-44 border-b border-border pb-2">
            {[45, 62, 55, 78, 90, 84, 96, 110, 88, 95, 120, 135].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div
                  style={{ height: `${(h / 140) * 100}%` }}
                  className="w-full bg-accent/80 group-hover:bg-accent rounded-t transition-all"
                />
                <span className="text-[10px] text-text-muted hidden sm:block">Day {i + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted pt-2">
            <span>Period: Aug 1 - Aug 25</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent" /> Commerce GMV</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" /> Reel Conversions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tables Row: Recent Orders & Recent Reels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card variant="default">
          <CardHeader>
            <h3 className="font-bold text-sm text-text-primary">Recent Customer Orders</h3>
            <Button size="sm" variant="ghost">View All</Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-secondary border-b border-border">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-secondary/50">
                    <td className="p-3 font-bold text-text-primary">{ord.orderNumber}</td>
                    <td className="p-3 text-text-muted">{ord.date}</td>
                    <td className="p-3 font-bold text-accent">₹{ord.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          ord.status === 'Delivered'
                            ? 'success'
                            : ord.status === 'In Transit'
                            ? 'warning'
                            : ord.status === 'Cancelled'
                            ? 'danger'
                            : 'info'
                        }
                        size="sm"
                      >
                        {ord.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent Reels Moderation */}
        <Card variant="default">
          <CardHeader>
            <h3 className="font-bold text-sm text-text-primary">Trending Creator Reels</h3>
            <Button size="sm" variant="ghost">Moderation Queue</Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {mockReels.map((reel) => (
              <div key={reel.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-secondary/40 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={reel.thumbnail} alt={reel.caption} className="w-10 h-10 rounded object-cover shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-text-primary truncate">@{reel.creator.username}</span>
                    <span className="text-[11px] text-text-muted truncate">{reel.caption}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-accent flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {(reel.likesCount * 3).toLocaleString()}
                  </span>
                  <Badge variant="verified" size="sm">Approved</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
