import React, { useState, useEffect } from 'react';
import { reelService } from '../../services/api/reelApi.js';
import { ReelCard } from '../../components/common/ReelCard.jsx';
import { ReelSkeleton } from '../../components/ui/Skeletons.jsx';
import { Film, Sparkles } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Film className="w-3.5 h-3.5" />
          <span>Interactive Social Video Commerce</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Watch & Shop <span className="text-amber-400">Reels</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Discover products through short videos created by authentic influencers and local artisans. Click tagged products to add them directly to your cart.
        </p>
      </div>

      {/* Reel Feed Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReelSkeleton />
          <ReelSkeleton />
          <ReelSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      )}
    </div>
  );
};
