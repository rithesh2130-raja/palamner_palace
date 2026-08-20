import React, { useState, useEffect, useRef } from 'react';
import { reelService } from '../../services/api/reelApi.js';
import { ReelCard } from '../../components/common/ReelCard.jsx';
import { Film, ChevronUp, ChevronDown } from 'lucide-react';

export const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const containerRef = useRef(null);
  const itemRefs = useRef([]);

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

  // Intersection Observer for Snap Scrolling & Autoplay Scoping
  useEffect(() => {
    if (reels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveReelIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // Reel must be 60% visible
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      itemRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [reels]);

  // Keyboard navigation support (ArrowDown / ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToReel(activeReelIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToReel(activeReelIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex, reels.length]);

  const scrollToReel = (index) => {
    if (index >= 0 && index < reels.length && itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 top-28 md:top-16 bg-black text-white overflow-hidden select-none z-30">
      {loading ? (
        <div className="h-full w-full flex flex-col items-center justify-center space-y-4 animate-pulse">
          <Film className="w-12 h-12 text-[#E50914] animate-bounce" />
          <p className="text-xs font-bold text-neutral-400">Loading PalamnerPalace Shoppable Reels Feed...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <Film className="w-16 h-16 text-neutral-600" />
          <h3 className="text-xl font-bold text-white">No Reels Available</h3>
          <p className="text-xs text-neutral-400 max-w-sm">
            Generate your first AI Video Advertisement in Admin Studio and click <strong>Publish as Reel</strong> to make it shoppable!
          </p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          {/* Snap-Scroll Feed Container */}
          <div
            ref={containerRef}
            className="reels-feed h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
            style={{ scrollSnapType: 'y mandatory', overscrollBehaviorY: 'contain' }}
          >
            {reels.map((reel, index) => (
              <div
                key={reel.id || reel._id}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
                className="reel-item h-full w-full snap-start snap-always relative flex items-center justify-center bg-black"
                style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
              >
                <ReelCard reel={reel} isActive={index === activeReelIndex} />
              </div>
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden lg:flex flex-col gap-3 fixed right-8 top-1/2 -translate-y-1/2 z-40">
            <button
              onClick={() => scrollToReel(activeReelIndex - 1)}
              disabled={activeReelIndex === 0}
              aria-label="Previous Reel"
              className="p-3 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-center text-neutral-400">
              {activeReelIndex + 1} / {reels.length}
            </span>
            <button
              onClick={() => scrollToReel(activeReelIndex + 1)}
              disabled={activeReelIndex === reels.length - 1}
              aria-label="Next Reel"
              className="p-3 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
