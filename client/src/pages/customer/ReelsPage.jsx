import React, { useState, useEffect } from 'react';
import { reelService } from '../../services/api/reelApi.js';
import { ReelCard } from '../../components/common/ReelCard.jsx';
import { ReelSkeleton } from '../../components/ui/Skeletons.jsx';
import { Film, Sparkles, Flame } from 'lucide-react';

export const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReels = async () => {
      setLoading(true);
      try {
        const data = await reelService.getReels();
        setReels(data);
      } catch (err) {
        console.error('Failed to load reels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReels();
  }, []);

  return (
    <div className="bg-white min-h-screen py-8 space-y-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#E50914] text-xs font-black uppercase tracking-wider">
          <Film className="w-3.5 h-3.5" />
          <span>PALAMNERPALACE SHOPPABLE REELS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
          Watch & Shop <span className="text-[#E50914]">Live Reels</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
          Discover products through high-converting short video advertisements and creator content. Click <strong>Shop Now</strong> on any reel to buy instantly.
        </p>
      </div>

      {/* Reel Feed Container */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <ReelSkeleton />
          <ReelSkeleton />
          <ReelSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {reels.map((reel) => (
            <ReelCard key={reel.id || reel._id} reel={reel} />
          ))}
        </div>
      )}
    </div>
  );
};
