import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Check, Wand2, Download } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';
import useVideoGenerationJob from '../../hooks/useVideoGenerationJob.js';

export const CenterVideoPreview = ({ isGenerating, setIsGenerating, onUseVideo }) => {
  const {
    currentJobId,
    currentVideoUrl,
    setCurrentVideoUrl,
    selectedProduct,
    selectedCTA,
    setIsPublishModalOpen,
  } = useAIStudioStore();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Poll video generation job using TanStack Query
  const { data: jobData } = useVideoGenerationJob(currentJobId);

  useEffect(() => {
    if (jobData) {
      if (jobData.status === 'COMPLETED' && jobData.outputVideoUrl) {
        setCurrentVideoUrl(jobData.outputVideoUrl);
        setIsGenerating(false);
      } else if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(jobData.status)) {
        setIsGenerating(false);
      }
    }
  }, [jobData, setCurrentVideoUrl, setIsGenerating]);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const currentStatusMsg = () => {
    if (!jobData) return 'Preparing generation...';
    if (jobData.status === 'QUEUED') return 'Queued in xAI pipeline...';
    if (jobData.status === 'GENERATING') return `Generating video frames (${jobData.progress || 45}%)...`;
    if (jobData.status === 'PROCESSING') return 'Finalizing video output & thumbnails...';
    if (jobData.status === 'COMPLETED') return 'Video Ready!';
    if (jobData.status === 'FAILED') return jobData.errorMessage || 'Generation failed';
    return 'Processing AI Reel...';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-950 border border-gray-800 rounded-2xl shadow-xl min-h-[550px] relative overflow-hidden select-none">
      {/* 9:16 Vertical Phone Preview Frame */}
      <div className="relative w-[320px] sm:w-[350px] h-[580px] bg-black rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl flex flex-col justify-between">
        {/* Active Generated Video Player */}
        {currentVideoUrl ? (
          <div className="relative w-full h-full bg-black group" onClick={handleTogglePlay}>
            <video
              ref={videoRef}
              src={currentVideoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between pointer-events-none">
              {/* Top Reel Badge */}
              <div className="flex items-center justify-between text-white pointer-events-auto">
                <Badge variant="deal" size="sm">AI REEL PREVIEW</Badge>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Center Play/Pause Trigger */}
              <div className="flex items-center justify-center pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay();
                  }}
                  className="p-4 rounded-full bg-accent/90 text-gray-950 shadow-xl hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
              </div>

              {/* Bottom Tagged Product CTA Strip */}
              {selectedProduct && (
                <div className="p-3 rounded-xl bg-gray-900/90 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3 text-white pointer-events-auto">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={selectedProduct.image} alt={selectedProduct.title} className="w-9 h-9 rounded object-cover shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">{selectedProduct.title}</span>
                      <span className="text-xs text-accent font-extrabold">₹{selectedProduct.price}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="primary" className="text-xs font-bold shrink-0">
                    {selectedCTA || 'SHOP NOW'}
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom Progress Bar Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-accent transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : isGenerating ? (
          /* Active Generation Progress Screen */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-white space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-accent">
                <Wand2 className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <Badge variant="prime" size="sm">xAI Grok Imagine Video 1.5</Badge>
              <h3 className="text-base font-bold text-white leading-tight">
                {currentStatusMsg()}
              </h3>
              <p className="text-xs text-gray-400">
                Generating 9:16 vertical commercial frames. This usually takes 5-15 seconds.
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full max-w-xs bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full transition-all duration-300"
                style={{ width: `${jobData?.progress || 35}%` }}
              />
            </div>
          </div>
        ) : (
          /* Initial Empty State */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-gray-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-accent">
              <Wand2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No Video Generated</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                AI-generated product video preview will appear here in 9:16 Reel format.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Toolbar Below Video Preview */}
      {currentVideoUrl && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Check}
            onClick={onUseVideo || (() => setIsPublishModalOpen(true))}
            className="font-bold text-xs shadow-md"
          >
            USE THIS VIDEO
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={RotateCcw}
            onClick={() => setCurrentVideoUrl(null)}
            className="text-gray-300 border-gray-700 hover:bg-white/10 text-xs font-semibold"
          >
            Regenerate
          </Button>

          <a href={currentVideoUrl} download="shopsphere-ai-reel.mp4" target="_blank" rel="noreferrer">
            <Button
              variant="ghost"
              size="md"
              icon={Download}
              className="text-gray-300 hover:bg-white/10 text-xs"
            >
              Download
            </Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default CenterVideoPreview;
