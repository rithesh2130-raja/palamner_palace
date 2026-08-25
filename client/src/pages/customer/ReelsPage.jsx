import React, { useState } from 'react';
import PageContainer from '../../components/common/PageContainer.jsx';
import ReelShell from '../../components/reels/ReelShell.jsx';
import { mockReels } from '../../mock/index.js';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export const ReelsPage = () => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const handleNextReel = () => {
    setActiveReelIndex((prev) => (prev + 1) % mockReels.length);
  };

  const handlePrevReel = () => {
    setActiveReelIndex((prev) => (prev - 1 + mockReels.length) % mockReels.length);
  };

  return (
    <PageContainer className="py-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 text-center">
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        <h1 className="text-xl font-black text-text-primary uppercase tracking-wide">
          ShopSphere Social Reels Feed
        </h1>
      </div>

      <div className="relative w-full flex items-center justify-center gap-6">
        {/* Navigation Controls for Desktop */}
        <div className="hidden lg:flex flex-col gap-3">
          <button
            onClick={handlePrevReel}
            className="p-3 rounded-full bg-surface border border-border hover:bg-surface-secondary text-text-primary transition-colors shadow-md"
            aria-label="Previous reel"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextReel}
            className="p-3 rounded-full bg-surface border border-border hover:bg-surface-secondary text-text-primary transition-colors shadow-md"
            aria-label="Next reel"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Current Active Reel */}
        <ReelShell reel={mockReels[activeReelIndex]} />
      </div>
    </PageContainer>
  );
};

export default ReelsPage;
