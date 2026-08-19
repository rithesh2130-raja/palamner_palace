import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { advertisementService } from '../../services/api/advertisementApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Sparkles, Film, Plus, Play, CheckCircle2, Wand2, ArrowRight } from 'lucide-react';

export const AdminAdvertisementsPage = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await advertisementService.getAdvertisements();
      setAdvertisements(data);
    } catch (err) {
      console.error('Failed to load advertisements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handlePublishAsReel = async (adId) => {
    try {
      const result = await advertisementService.publishAdvertisementAsReel(adId);
      showToast(result.message || 'Published as Reel!', 'success');
      loadAds();
    } catch (err) {
      showToast(err.message || 'Failed to publish reel', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-[#E50914] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advertisement Studio</span>
          </div>
          <h1 className="text-2xl font-black text-white">Generated Advertisements</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage AI video advertisements generated with Gemini Omni Flash. Publish ads as shoppable Reels.
          </p>
        </div>

        <Link to="/admin/advertisements/create">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            <span>Create AI Advertisement</span>
          </Button>
        </Link>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="text-center py-12 text-neutral-400 text-xs animate-pulse">
          Loading advertisement history...
        </div>
      ) : advertisements.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-4">
          <Wand2 className="w-12 h-12 text-[#E50914] mx-auto" />
          <h3 className="text-lg font-bold text-white">No AI Advertisements Generated Yet</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Select any product from your catalog and use Gemini Omni Flash to generate dynamic 9:16 short video ads.
          </p>
          <Link to="/admin/advertisements/create" className="inline-block pt-2">
            <Button variant="primary" size="md">
              Create First AI Ad
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <div
              key={ad._id || ad.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-red-500/50 transition-all"
            >
              <div>
                {/* 9:16 Thumbnail Container */}
                <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
                  <img
                    src={ad.thumbnailUrl || ad.product?.image}
                    alt={ad.product?.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none"></div>

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#E50914] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      {ad.objective}
                    </span>
                    <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                      {ad.aspectRatio}
                    </span>
                  </div>

                  {ad.publishedAsReel && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Published Reel
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#E50914] tracking-wider">
                      {ad.product?.brand}
                    </span>
                    <h4 className="text-xs font-extrabold truncate">{ad.product?.title}</h4>
                    <p className="text-[10px] text-neutral-300 font-medium line-clamp-1">
                      Style: {ad.visualStyle} • Tone: {ad.tone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-2">
                <Link
                  to="/reels"
                  className="text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1"
                >
                  <Film className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Preview Feed</span>
                </Link>

                {!ad.publishedAsReel ? (
                  <button
                    onClick={() => handlePublishAsReel(ad._id || ad.id)}
                    className="px-3 py-1.5 bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish Reel</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Live in Reels
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
