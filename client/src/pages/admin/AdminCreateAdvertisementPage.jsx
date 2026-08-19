import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { advertisementService } from '../../services/api/advertisementApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { getMediaUrl } from '../../utils/mediaUrl.js';
import { Sparkles, Wand2, Film, RefreshCw, ArrowLeft, Send, Upload, AlertCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AdminCreateAdvertisementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  // File Upload & Preview State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Default Test Prompt
  const [description, setDescription] = useState(
    'Use the supplied image as the starting frame. Create a single continuous product video of the exact blue shirt. Slowly push the camera toward it and make a subtle orbit. Preserve the exact blue color and design. Keep the shirt visible throughout. Add realistic fabric movement and professional studio lighting. Use a clean neutral background. End with a premium hero shot. Do not introduce any unrelated object or scene.'
  );
  const [visualStyle, setVisualStyle] = useState('Cinematic');

  // Generation Lifecycle States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedAd, setGeneratedAd] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [videoLoadError, setVideoLoadError] = useState(false);

  // Conversational AI Edit State
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid product image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    setGeneratedAd(null);
    setGenerationError(null);
    setVideoLoadError(false);
    setEditInstruction('');

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setGeneratedAd(null);
    setGenerationError(null);
    setVideoLoadError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateAd = async (e) => {
    if (e) e.preventDefault();

    if (!selectedFile) {
      showToast('Please select a product reference image to upload', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Please enter an advertisement description', 'error');
      return;
    }

    setGeneratedAd(null);
    setGenerationError(null);
    setVideoLoadError(false);

    setIsGenerating(true);
    setGenerationStep('Creating your unique PalamnerPalace product advertisement...');

    try {
      setTimeout(() => setGenerationStep('Uploading product reference image...'), 300);
      setTimeout(() => setGenerationStep('Calling Gemini Omni Flash video engine with <FIRST_FRAME> binding...'), 900);

      const formData = new FormData();
      formData.append('image', selectedFile, selectedFile.name);
      formData.append('prompt', description.trim());
      formData.append('style', visualStyle);
      formData.append('aspectRatio', '9:16');

      const result = await advertisementService.generateAdvertisement(formData);
      const adData = result?.advertisement || result?.data || result;

      if (!adData || !adData.videoUrl) {
        throw new Error('Server generated invalid advertisement response (missing videoUrl).');
      }

      setGeneratedAd(adData);
      showToast('AI Advertisement video generated successfully!', 'success');
    } catch (err) {
      console.error('Generation Error:', err);
      const errMsg = err.message || 'AI Advertisement generation failed.';
      setGenerationError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleApplyEdit = async () => {
    if (!editInstruction.trim() || !generatedAd) return;
    setIsEditing(true);
    try {
      const result = await advertisementService.editAdvertisement(
        generatedAd._id || generatedAd.id,
        editInstruction.trim()
      );
      setGeneratedAd(result.advertisement || result.data || result);
      setEditInstruction('');
      showToast('AI Edit applied to video!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to apply AI edit', 'error');
    } finally {
      setIsEditing(false);
    }
  };

  const handlePublishAsReel = async () => {
    if (!generatedAd) return;
    try {
      const result = await advertisementService.publishAdvertisementAsReel(
        generatedAd._id || generatedAd.id
      );
      showToast('Published as shoppable Reel! 🎬', 'success');
      navigate('/reels');
    } catch (err) {
      showToast(err.message || 'Failed to publish reel', 'error');
    }
  };

  const rawVideoUrl = generatedAd ? getMediaUrl(generatedAd.videoUrl) : '';
  const videoSourceUrl = generatedAd
    ? `${rawVideoUrl}?generation=${generatedAd.generationId || generatedAd._id || Date.now()}`
    : '';

  const posterSourceUrl = previewUrl || (generatedAd ? getMediaUrl(generatedAd.thumbnailUrl || generatedAd.uploadedImageUrl) : '');

  const isLocalFallback = generatedAd && (
    generatedAd.isRealGeminiOutput === false ||
    generatedAd.quotaErrorOccurred === true ||
    (generatedAd.geminiInteractionId && generatedAd.geminiInteractionId.startsWith('local-'))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <button
            onClick={() => navigate('/admin/advertisements')}
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Advertisements
          </button>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#E50914]" />
            <span>AI ADVERTISEMENT STUDIO</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Upload a product reference image, describe video movement, and generate 9:16 AI product ads with Gemini Omni Flash.
          </p>
        </div>
      </div>

      {/* Two Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Controls (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleGenerateAd} className="space-y-5">
            {/* Upload Reference Image Zone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Upload Product Reference Image</span>
                <span className="text-[10px] text-red-500 font-bold">*Required</span>
              </label>

              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-700 hover:border-[#E50914] rounded-2xl p-8 text-center cursor-pointer transition-all bg-black/50 hover:bg-black group"
                >
                  <Upload className="w-10 h-10 text-neutral-500 group-hover:text-[#E50914] mx-auto mb-2 transition-colors" />
                  <div className="text-sm font-bold text-white">Drag & Drop product reference image</div>
                  <div className="text-xs text-neutral-400 mt-1">Supports JPG, JPEG, PNG, WEBP (Up to 15MB)</div>
                  <button
                    type="button"
                    className="mt-3 px-4 py-1.5 bg-neutral-800 text-xs font-bold text-white rounded-lg group-hover:bg-[#E50914]"
                  >
                    Browse Image
                  </button>
                </div>
              ) : (
                <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-neutral-700 group">
                  <img src={previewUrl} alt="Product Reference Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-neutral-200"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Describe Your Product Advertisement
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how you want your product advertisement to look and move..."
                className="w-full bg-black border border-neutral-700 rounded-xl p-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] leading-relaxed"
              />
            </div>

            {/* Optional Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Visual Style</label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Minimal">Minimal</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Fast-paced">Fast-paced</option>
                  <option value="Product showcase">Product showcase</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Aspect Ratio</label>
                <input
                  type="text"
                  value="9:16"
                  readOnly
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-400 font-bold"
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-red-600/30 text-sm tracking-wide"
              isLoading={isGenerating}
            >
              <Sparkles className="w-5 h-5" />
              <span>✨ GENERATE VIDEO</span>
            </Button>
          </form>
        </div>

        {/* Right Column: Preview & Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-[#E50914]" />
              <span>Video Preview (9:16)</span>
            </h3>

            {isGenerating ? (
              <div className="w-full aspect-[9/16] bg-black rounded-2xl border border-neutral-800 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-pulse">
                <Wand2 className="w-10 h-10 text-[#E50914] animate-bounce" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">AI IS CREATING YOUR VIDEO</h4>
                  <p className="text-xs text-neutral-400 font-medium">Your product advertisement is being generated with Gemini...</p>
                  <p className="text-[11px] text-[#E50914] font-bold mt-2">{generationStep}</p>
                </div>
              </div>
            ) : generationError ? (
              <div className="p-5 bg-red-950/80 border border-red-600 rounded-2xl space-y-3 text-left">
                <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  <span>AI Advertisement generation failed.</span>
                </div>
                <p className="text-xs text-red-200 leading-relaxed">{generationError}</p>
                <Button variant="outline" size="sm" onClick={handleGenerateAd}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </Button>
              </div>
            ) : generatedAd ? (
              <div className="space-y-4">
                {/* Quota Exceeded — show product image panel instead of unrelated fallback video */}
                {isLocalFallback ? (
                  <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto bg-black rounded-2xl overflow-hidden border-2 border-amber-500 shadow-2xl flex flex-col">
                    {/* Product image fills top portion */}
                    {posterSourceUrl && (
                      <img
                        src={posterSourceUrl}
                        alt="Uploaded product reference"
                        className="w-full h-[65%] object-contain bg-neutral-950"
                      />
                    )}
                    {/* Quota error info panel at bottom */}
                    <div className="flex-1 bg-amber-950/90 flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <AlertTriangle className="w-7 h-7 text-amber-400" />
                      <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                        Gemini API Quota Exceeded
                      </div>
                      <p className="text-[10px] text-amber-200 leading-relaxed">
                        Free-tier 429 limit reached. No video was generated. Enable billing on your Gemini API key to generate a real product video.
                      </p>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] rounded-lg uppercase tracking-wide"
                      >
                        Enable Billing →
                      </a>
                    </div>
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase pointer-events-none">
                      QUOTA EXCEEDED
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto bg-black rounded-2xl overflow-hidden border-2 border-[#E50914] shadow-2xl group">
                    {videoLoadError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2 bg-neutral-950 text-red-400">
                        <AlertCircle className="w-8 h-8" />
                        <div className="text-xs font-bold">Generated video could not be loaded.</div>
                        <button
                          onClick={() => setVideoLoadError(false)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <video
                        key={generatedAd.generationId || generatedAd._id || generatedAd.id}
                        controls
                        playsInline
                        preload="metadata"
                        muted
                        src={videoSourceUrl}
                        poster={posterSourceUrl}
                        onError={(event) => {
                          console.error('VIDEO PLAYBACK ERROR', event.currentTarget.error, event.currentTarget.src);
                          setVideoLoadError(true);
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-[#E50914] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase pointer-events-none">
                      VIDEO READY
                    </div>
                  </div>
                )}

                {/* GENERATION DEBUG PANEL */}
                <div className="p-3 bg-black border border-neutral-800 rounded-xl space-y-1 text-[11px] text-neutral-400 font-mono">
                  <div className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GENERATION DEBUG</span>
                  </div>
                  <div className="truncate"><span className="text-neutral-500">Generation ID:</span> <span className="text-emerald-400 font-bold">{generatedAd.generationId || 'N/A'}</span></div>
                  <div className="truncate"><span className="text-neutral-500">Gemini Interaction:</span> <span className="text-white">{generatedAd.geminiInteractionId || 'N/A'}</span></div>
                  <div className="truncate"><span className="text-neutral-500">Input Image Hash:</span> <span className="text-amber-400">{generatedAd.inputImageHash ? generatedAd.inputImageHash.substring(0, 16) + '...' : 'N/A'}</span></div>
                  <div className="truncate"><span className="text-neutral-500">Video Hash:</span> <span className="text-cyan-400">{generatedAd.videoHash ? generatedAd.videoHash.substring(0, 16) + '...' : 'N/A'}</span></div>
                  <div className="truncate"><span className="text-neutral-500">Video URL:</span> <span className="text-neutral-300">{generatedAd.videoUrl}</span></div>
                </div>

                {/* Conversational AI Edit */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <label className="block text-xs font-bold text-white">Conversational AI Edit</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tell AI what to change (e.g. Change lighting to dramatic)..."
                      value={editInstruction}
                      onChange={(e) => setEditInstruction(e.target.value)}
                      className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                    <button
                      onClick={handleApplyEdit}
                      disabled={isEditing || !editInstruction.trim()}
                      className="p-2 bg-[#E50914] hover:bg-[#B20710] text-white rounded-xl transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleGenerateAd}>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </Button>

                  <Button variant="primary" size="sm" onClick={handlePublishAsReel}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>PUBLISH AS REEL</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[9/16] bg-black rounded-2xl border border-neutral-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <Film className="w-10 h-10 text-neutral-600" />
                <p className="text-xs text-neutral-400">
                  Upload a product image and describe your advertisement on the left, then click <strong>✨ GENERATE VIDEO</strong> to view real 9:16 AI product video rendering.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
