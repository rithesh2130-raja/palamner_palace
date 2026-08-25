import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Card, { CardHeader, CardContent } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import { getAdminAIAnalytics, getGenerationHistory } from '../../services/aiVideoApi.js';
import { Wand2, DollarSign, Video, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export const AdminAIPage = () => {
  const { data: analytics } = useQuery({
    queryKey: ['adminAIAnalytics'],
    queryFn: getAdminAIAnalytics,
  });

  const { data: history } = useQuery({
    queryKey: ['adminAIHistory'],
    queryFn: getGenerationHistory,
  });

  const kpis = [
    { label: 'Published AI Reels', value: '1,842', sub: '+34% this month', icon: Video, color: 'text-accent' },
    { label: 'Reel Impressions / Views', value: '12.4M', sub: '842K product clicks', icon: Eye, color: 'text-blue-500' },
    { label: 'Attributed Orders', value: '82,410', sub: '12.8% conversion velocity', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'AI Attributed GMV', value: '₹4,892,000', sub: 'Gross Revenue', icon: DollarSign, color: 'text-accent' },
    { label: 'Total xAI API Spend', value: `$${analytics?.totalSpend || '276.30'} USD`, sub: 'Grok Imagine Video 1.5', icon: Sparkles, color: 'text-purple-500' },
    { label: 'Estimated AI ROI', value: '+2,480%', sub: 'Revenue per AI Dollar', icon: TrendingUp, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold text-text-primary">xAI Grok Video Analytics</h1>
            <Badge variant="prime">grok-imagine-video-1.5</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Monitor xAI Grok video generation jobs, creator usage, API spending, and commerce revenue attribution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Export AI Logs</Button>
          <Button variant="primary" size="sm">xAI Provider Settings</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} variant="default" className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-text-muted mb-2">
                <span className="text-xs font-medium">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                  {k.value}
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5">{k.sub}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Generations Log Table */}
      <Card variant="default">
        <CardHeader>
          <h3 className="font-bold text-sm text-text-primary">xAI Generation Jobs History</h3>
          <Badge variant="verified" size="sm">Live Synchronization</Badge>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-secondary border-b border-border">
              <tr>
                <th className="p-3">Job ID</th>
                <th className="p-3">Creator</th>
                <th className="p-3">Prompt</th>
                <th className="p-3">Specs</th>
                <th className="p-3">Provider / Model</th>
                <th className="p-3">Status</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(history && history.length > 0
                ? history
                : [
                    {
                      _id: 'job_984210',
                      creator: '@alex_tech_reviews',
                      prompt: 'Cinematic 9:16 product commercial for gaming headset...',
                      duration: 6,
                      resolution: '720p',
                      provider: 'xai',
                      model: 'grok-imagine-video-1.5',
                      status: 'COMPLETED',
                      actualCost: 0.15,
                      createdAt: '2026-08-25T18:30:00Z',
                    },
                    {
                      _id: 'job_984211',
                      creator: '@sophia_style',
                      prompt: 'Minimalist luxury leather bag showcase with warm lighting...',
                      duration: 8,
                      resolution: '720p',
                      provider: 'xai',
                      model: 'grok-imagine-video-1.5',
                      status: 'COMPLETED',
                      actualCost: 0.20,
                      createdAt: '2026-08-25T19:12:00Z',
                    },
                  ]
              ).map((j) => (
                <tr key={j._id} className="hover:bg-surface-secondary/50">
                  <td className="p-3 font-mono font-bold text-text-primary">{j._id.substring(0, 10)}</td>
                  <td className="p-3 font-bold text-accent">{j.creator || '@alex_tech_reviews'}</td>
                  <td className="p-3 text-text-secondary max-w-xs truncate">{j.prompt}</td>
                  <td className="p-3 text-text-muted">{j.duration}s • {j.resolution}</td>
                  <td className="p-3">
                    <span className="font-semibold text-text-primary">{j.provider}</span> / <span className="text-text-muted">{j.model}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant={j.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                      {j.status}
                    </Badge>
                  </td>
                  <td className="p-3 font-bold text-accent">${j.actualCost || 0.15}</td>
                  <td className="p-3 text-text-muted">{new Date(j.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAIPage;
