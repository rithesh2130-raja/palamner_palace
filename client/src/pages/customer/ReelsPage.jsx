import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../../components/common/PageContainer.jsx';
import ReelShell from '../../components/reels/ReelShell.jsx';
import reelService from '../../services/api/reelApi.js';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartYRef = React.useRef(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    reelService
      .getReels()
      .then((data) => {
        if (isMounted) {
          setReels(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNextReel = useCallback(() => {
    if (reels.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % reels.length);
  }, [reels.length]);

  const handlePrevReel = useCallback(() => {
    if (reels.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + reels.length) % reels.length);
  }, [reels.length]);

  // Keyboard Navigation (Up / Down Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextReel, handlePrevReel]);

  // Touch Swipe Vertical Gesture Handlers
  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartYRef.current - touchEndY;

    if (Math.abs(diffY) > 50) {
      if (diffY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }
    }
  };

  return (
    <PageContainer className="py-4 flex flex-col items-center min-h-screen">
      <div className="flex items-center gap-2 mb-3 text-center">
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        <h1 className="text-lg font-black text-text-primary uppercase tracking-wide">
          ShopSphere Social Reels Feed
        </h1>
      </div>

      {loading ? (
        <div className="h-[650px] w-full max-w-md bg-black rounded-2xl border border-gray-800 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-accent mb-3" />
          <p className="text-xs font-bold text-gray-400">Loading Social Discovery Feed...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="h-[400px] w-full max-w-md bg-surface border border-border rounded-2xl flex flex-col justify-center items-center text-center p-6">
          <Sparkles className="w-10 h-10 text-text-tertiary mb-2" />
          <h3 className="text-sm font-bold text-text-primary">No Reels Available</h3>
          <p className="text-xs text-text-secondary mt-1">Check back soon for new creator video reels!</p>
        </div>
      ) : (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full flex items-center justify-center gap-6"
        >
          {/* Vertical Desktop Control Buttons */}
          <div className="hidden lg:flex flex-col gap-3 items-center">
            <button
              onClick={handlePrevReel}
              className="p-3 rounded-full bg-surface border border-border hover:bg-surface-secondary text-text-primary transition-all shadow-md hover:scale-110 active:scale-95"
              aria-label="Previous reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-extrabold text-text-tertiary">
              {activeIndex + 1} / {reels.length}
            </span>

            <button
              onClick={handleNextReel}
              className="p-3 rounded-full bg-surface border border-border hover:bg-surface-secondary text-text-primary transition-all shadow-md hover:scale-110 active:scale-95"
              aria-label="Next reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Active Reel Shell */}
          <ReelShell reel={reels[activeIndex]} isActive={true} />
        </div>
      )}
    </PageContainer>
  );
};

export default ReelsPage;
