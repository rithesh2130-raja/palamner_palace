import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wand2, History, LayoutTemplate, Upload, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';

export const StudioHeader = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useAIStudioStore();

  const tabs = [
    { id: 'AI GENERATE', label: 'AI Generate', icon: Sparkles },
    { id: 'UPLOAD', label: 'Upload Video', icon: Upload },
    { id: 'MY GENERATIONS', label: 'My Generations', icon: History },
    { id: 'TEMPLATES', label: 'Templates', icon: LayoutTemplate },
  ];

  return (
    <header className="h-[64px] bg-[#131A22] text-white border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 select-none">
      {/* LEFT: Back & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/creator/studio')}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          aria-label="Back to Studio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-gray-950 font-black shadow-sm">
            <Wand2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white leading-none">
                AI REEL STUDIO
              </span>
              <Badge variant="deal" size="sm">GROK VIDEO 1.5</Badge>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Social-Commerce Promotional Video Generator
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Workspace Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-accent text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* RIGHT: Free Tier Usage Protection Badge */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Free Usage Cap Active (5/day max)</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-white/10"
          onClick={() => navigate('/reels')}
        >
          View Reels Feed
        </Button>
      </div>
    </header>
  );
};

export default StudioHeader;
