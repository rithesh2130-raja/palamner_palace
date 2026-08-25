import React, { useState } from 'react';
import { Sparkles, Wand2, Film, Clock, Monitor, Coins } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';
import { generateVideo, enhancePrompt as callEnhancePrompt } from '../../services/aiVideoApi.js';

export const LeftControlPanel = ({ isGenerating, setIsGenerating, onError }) => {
  const {
    prompt,
    setPrompt,
    stylePreset,
    setStylePreset,
    aspectRatio,
    setAspectRatio,
    duration,
    setDuration,
    resolution,
    setResolution,
    selectedProduct,
    setCurrentJobId,
    setCurrentVideoUrl,
  } = useAIStudioStore();

  const [isEnhancing, setIsEnhancing] = useState(false);

  const styleOptions = [
    { name: 'Cinematic', desc: 'Dramatic lighting & shallow focus' },
    { name: 'Product Commercial', desc: 'Clean studio rim light & macro details' },
    { name: 'Lifestyle', desc: 'Warm natural light & cozy atmosphere' },
    { name: 'Minimal', desc: 'Scandinavian clean background' },
    { name: 'Luxury', desc: 'Glossy dark surface & gold accents' },
    { name: 'Gaming', desc: 'Neon RGB lighting & cyber haze' },
    { name: 'Futuristic', desc: 'Holographic glow & sci-fi textures' },
    { name: 'Street', desc: 'Raw urban contrast & high energy' },
  ];

  const presets = [
    { label: 'Product Showcase', prompt: 'Create a crisp 9:16 commercial showcasing this product. Smooth camera rotation, studio rim lighting, macro focus on textures.' },
    { label: 'Cinematic', prompt: 'Anamorphic lens flare, dramatic lighting, 60fps slow motion, shallow depth of field, futuristic dark background.' },
    { label: 'Unboxing', prompt: 'First-person perspective product unboxing, clean hands movement, bright studio lighting, realistic reflections.' },
    { label: 'Lifestyle', prompt: 'Warm morning sunlight, minimalist apartment setting, organic product usage demonstration.' },
    { label: 'Luxury', prompt: 'Glossy dark glass surface, gold and obsidian lighting accents, slow dramatic camera push-in.' },
    { label: 'Gaming', prompt: 'Futuristic gaming setup, neon cyan and magenta RGB lighting, subtle haze, cybernetic aesthetic.' },
    { label: 'Fashion', prompt: 'Vogue editorial style, high fashion studio lighting, bold color contrast, smooth pan.' },
    { label: 'Sale', prompt: 'Eye-catching promotional video, vibrant accent lighting, dynamic zoom effect.' },
  ];

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await callEnhancePrompt(prompt, selectedProduct || {});
      setPrompt(enhanced);
    } catch {
      // Fallback local enhancement if offline
      setPrompt(`Create a premium cinematic 9:16 social commercial advertisement. ${prompt}. Professional studio lighting, shallow depth of field, 60fps smooth camera pan, macro texture close-ups.`);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setCurrentVideoUrl(null);
    setCurrentJobId(null);

    try {
      const data = await generateVideo({
        prompt,
        productId: selectedProduct?.id || selectedProduct?._id || null,
        duration: Number(duration),
        aspectRatio,
        resolution,
        inputImageUrl: selectedProduct?.image || null,
      });

      if (data.jobId) {
        setCurrentJobId(data.jobId);
      }
    } catch (err) {
      setIsGenerating(false);
      if (onError) onError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 bg-surface border border-border rounded-2xl shadow-xs overflow-y-auto">
      {/* Panel Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-text-primary uppercase tracking-wide">
            CREATE WITH AI
          </h2>
        </div>
        <Badge variant="prime" size="sm">xAI Grok Video</Badge>
      </div>

      {/* 1. Prompt Textarea & Counter */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Video Prompt Description
          </label>
          <button
            type="button"
            onClick={handleEnhance}
            disabled={isEnhancing || isGenerating || !prompt.trim()}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}</span>
          </button>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.substring(0, 1000))}
            disabled={isGenerating}
            rows={4}
            placeholder="Describe the Reel video you want Grok AI to generate..."
            className="w-full p-3 text-xs bg-surface-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none disabled:opacity-60"
          />
          <span className="absolute bottom-2.5 right-3 text-[10px] text-text-muted font-mono">
            {prompt.length}/1000
          </span>
        </div>
      </div>

      {/* 2. Quick Prompt Preset Chips */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
          Quick Preset Ideas
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              disabled={isGenerating}
              onClick={() => setPrompt(p.prompt)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-surface-secondary hover:bg-border text-text-secondary rounded-pill whitespace-nowrap transition-colors shrink-0"
            >
              + {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Style Selector Cards */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Visual Style Preset
        </span>
        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map((s) => {
            const isSelected = stylePreset === s.name;
            return (
              <button
                key={s.name}
                type="button"
                disabled={isGenerating}
                onClick={() => setStylePreset(s.name)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/10 text-text-primary font-bold shadow-xs'
                    : 'border-border bg-surface-secondary/60 text-text-secondary hover:border-text-muted'
                }`}
              >
                <div className="text-xs font-bold">{s.name}</div>
                <div className="text-[10px] text-text-muted line-clamp-1">{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Settings Grid: Aspect Ratio, Duration, Resolution */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
        {/* Aspect Ratio */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
            <Film className="w-3 h-3 text-accent" /> Ratio
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={isGenerating}
            className="h-9 px-2 text-xs font-bold bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="9:16">9:16 (Reels)</option>
            <option value="1:1">1:1 (Square)</option>
            <option value="16:9">16:9 (Landscape)</option>
          </select>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-accent" /> Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isGenerating}
            className="h-9 px-2 text-xs font-bold bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value={6}>6 Seconds</option>
            <option value={8}>8 Seconds</option>
            <option value={10}>10 Seconds</option>
          </select>
        </div>

        {/* Resolution */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
            <Monitor className="w-3 h-3 text-accent" /> Res
          </label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            disabled={isGenerating}
            className="h-9 px-2 text-xs font-bold bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="720p">720p HD</option>
            <option value="480p">480p SD</option>
            <option value="1080p">1080p FHD</option>
          </select>
        </div>
      </div>

      {/* 5. Generation Cost Estimate & Main Action Button */}
      <div className="flex flex-col gap-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1 font-medium">
            <Coins className="w-4 h-4 text-accent" /> Estimated Generation Cost:
          </span>
          <span className="font-extrabold text-accent text-sm">$0.15 USD</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isGenerating}
          onClick={handleGenerate}
          isDisabled={!prompt.trim()}
          icon={Sparkles}
          className="font-black text-sm uppercase tracking-wider shadow-md"
        >
          {isGenerating ? 'Generating Video...' : 'GENERATE REEL'}
        </Button>
      </div>
    </div>
  );
};

export default LeftControlPanel;
