import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Check, Wand2, Download, AlertTriangle, ShieldCheck, ExternalLink, Cpu } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';
import useVideoGenerationJob from '../../hooks/useVideoGenerationJob.js';

export const CenterVideoPreview = ({ isGenerating, setIsGenerating, onUseVideo, onRetry }) => {
  const {
    currentJobId,
    currentVideoUrl,
    setCurrentVideoUrl,
    xaiRequestId,
    setXaiRequestId,
    selectedProduct,
    selectedCTA,
    setIsPublishModalOpen,
    lastError,
    setLastError,
    duration,
    aspectRatio,
    resolution,
  } = useAIStudioStore();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Poll video generation job using TanStack Query (5s interval)
  const { data: jobData, isError, error: queryError } = useVideoGenerationJob(currentJobId);

  useEffect(() => {
    if (jobData) {
      if (jobData.xaiRequestId || jobData.jobId) {
        setXaiRequestId(jobData.xaiRequestId || jobData.jobId);
      }

      if (jobData.status === 'COMPLETED' && (jobData.videoUrl || jobData.outputVideoUrl)) {
        const finalUrl = jobData.videoUrl || jobData.outputVideoUrl;
        setCurrentVideoUrl(finalUrl);
        setIsGenerating(false);
        setLastError(null);
      } else if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(jobData.status)) {
        setIsGenerating(false);
        setLastError(jobData.error || jobData.errorMessage || `Wan 2.1 generation ${jobData.status.toLowerCase()}`);
      }
    }
  }, [jobData, setCurrentVideoUrl, setIsGenerating, setXaiRequestId, setLastError]);

  useEffect(() => {
    if (isError && queryError) {
      setIsGenerating(false);
      setLastError(queryError.message || 'Failed to poll generation job status');
    }
  }, [isError, queryError, setIsGenerating, setLastError]);

  // Sync video play/pause
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentVideoUrl]);

  const handleTogglePlay = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const durationVal = videoRef.current.duration || 1;
      setProgress((current / durationVal) * 100);
    }
  };

  const currentStatusMsg = () => {
    if (!jobData) return 'Submitting request to Wan 2.1 GPU pipeline...';
    if (jobData.status === 'QUEUED') return 'Queued in RunPod GPU worker pool...';
    if (jobData.status === 'GENERATING') return 'Rendering video with Wan 2.1 VACE 1.3B...';
    if (jobData.status === 'PROCESSING') return 'Finalizing MP4 video & uploading to CDN...';
    if (jobData.status === 'COMPLETED') return 'Video Ready!';
    if (jobData.status === 'FAILED') return jobData.error || 'Generation failed on GPU worker side';
    return 'Processing Wan 2.1 Reel...';
  };

  const activeJobId = xaiRequestId || jobData?.xaiRequestId || jobData?.jobId || null;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-950 border border-gray-800 rounded-2xl shadow-xl min-h-[550px] relative overflow-hidden select-none">
      {/* 9:16 Vertical Phone Preview Frame */}
      <div className="relative w-[320px] sm:w-[350px] h-[580px] bg-black rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl flex flex-col justify-between">
        {isGenerating ? (
          /* Active Generation Progress Screen */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-white space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-accent">
                <Wand2 className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <Badge variant="prime" size="sm">Wan 2.1 VACE 1.3B</Badge>
              <h3 className="text-base font-bold text-white leading-tight">
                {currentStatusMsg()}
              </h3>
              <p className="text-xs text-gray-400">
                Open-weight Wan 2.1 VACE inference in progress. Rendering 9:16 vertical commercial frames...
              </p>
            </div>

            {/* Proof Metadata Pill during generation */}
            {activeJobId && (
              <div className="p-2 rounded-lg bg-gray-950 border border-gray-800 text-[10px] font-mono text-gray-400 max-w-xs truncate">
                Wan 2.1 Job ID: <span className="text-accent">{activeJobId}</span>
              </div>
            )}
          </div>
        ) : lastError ? (
          /* Detailed Error Screen */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-red-400 space-y-4 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-2 max-w-xs">
              <Badge variant="danger" size="sm">WAN 2.1 GENERATION ERROR</Badge>
              <h4 className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
                GPU Worker Diagnostic Response
              </h4>
              <div className="p-3 rounded-xl bg-gray-950 border border-red-900/60 text-left space-y-1">
                <p className="text-xs font-mono font-medium text-red-200 break-words leading-relaxed">
                  {lastError}
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-[10px] font-mono text-gray-400 text-left w-full max-w-xs space-y-0.5">
              <div className="text-gray-300 font-bold">Request Diagnostic Context:</div>
              <div>• Model: Wan2.1-VACE-1.3B</div>
              <div>• Specs: {duration}s | {aspectRatio} | {resolution}</div>
              <div>• Pipeline: RunPod Serverless GPU</div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={RotateCcw}
              onClick={onRetry || (() => setLastError(null))}
              className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white border-none shadow-md shrink-0"
            >
              TRY AGAIN
            </Button>
          </div>
        ) : currentVideoUrl ? (
          /* Active Video Player Container */
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

            {/* Controls Overlay Header & Footer */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 p-4 flex flex-col justify-between pointer-events-none">
              {/* Top Reel Badge & Mute Toggle */}
              <div className="flex items-center justify-between text-white pointer-events-auto z-10">
                <Badge variant="deal" size="sm" className="shadow-md">WAN 2.1 REEL PREVIEW</Badge>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors shadow-md"
                  aria-label="Toggle Sound"
                >
                  {isMuted ? <VolumeX className="w-4.5 h-4.5 text-accent" /> : <Volume2 className="w-4.5 h-4.5 text-white" />}
                </button>
              </div>

              {/* Center Play/Pause Trigger */}
              <div className="flex items-center justify-center pointer-events-auto z-10">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`p-4 rounded-full bg-accent text-gray-950 shadow-2xl transition-all duration-200 ${
                    isPlaying ? 'opacity-0 group-hover:opacity-100 hover:scale-110' : 'opacity-100 scale-110'
                  }`}
                  aria-label="Play or Pause Video"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
              </div>

              {/* Bottom Tagged Product CTA Strip */}
              {selectedProduct && (
                <div className="p-3 rounded-xl bg-gray-900/90 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3 text-white pointer-events-auto shadow-lg z-10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={selectedProduct.image} alt={selectedProduct.title} className="w-9 h-9 rounded-md object-cover shrink-0 border border-white/20" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate text-white">{selectedProduct.title}</span>
                      <span className="text-xs text-accent font-extrabold">₹{selectedProduct.price?.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="primary" className="text-xs font-bold shrink-0">
                    {selectedCTA || 'SHOP NOW'}
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom Progress Bar Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
              <div className="h-full bg-accent transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          /* Ready Empty State */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-gray-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-accent">
              <Wand2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Ready for Wan 2.1 AI Generation</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Enter a prompt and click "GENERATE WAN 2.1 REEL" to run the Wan 2.1 VACE 1.3B Cloud GPU pipeline.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Proof Metadata Display Box */}
      {currentVideoUrl && (
        <div className="mt-3 w-full max-w-[350px] p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-[11px] font-mono text-gray-300 space-y-1">
          <div className="flex items-center justify-between text-accent font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Wan 2.1 VACE Output
            </span>
            <span>Wan2.1-VACE-1.3B</span>
          </div>
          {activeJobId && (
            <div className="truncate text-gray-400">
              Job ID: <span className="text-white font-bold">{activeJobId}</span>
            </div>
          )}
          <div className="truncate text-gray-400">
            Video CDN URL: <a href={currentVideoUrl} target="_blank" rel="noreferrer" className="text-accent underline inline-flex items-center gap-0.5">{currentVideoUrl.substring(0, 32)}... <ExternalLink className="w-3 h-3" /></a>
          </div>
        </div>
      )}

      {/* Action Toolbar Below Video Preview */}
      {currentVideoUrl && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
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
            onClick={onRetry}
            className="text-gray-300 border-gray-700 hover:bg-white/10 text-xs font-semibold"
          >
            Regenerate
          </Button>

          <a href={currentVideoUrl} download="shopsphere-wan21-reel.mp4" target="_blank" rel="noreferrer">
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
