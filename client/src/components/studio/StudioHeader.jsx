import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wand2, History, LayoutTemplate, Upload, Cpu, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';

export const StudioHeader = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useAIStudioStore();

  const tabs = [
    { id: 'AI GENERATE', label: 'Wan 2.1 Generate', icon: Sparkles },
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
                SHOPSPHERE AI STUDIO
              </span>
              <Badge variant="deal" size="sm">WAN 2.1 VACE 1.3B</Badge>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Open-Weight Cloud GPU E-Commerce Video Generator
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

      {/* RIGHT: Cloud GPU Status & Protection Badge */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-bold text-purple-300">
          <Cpu className="w-4 h-4 text-accent" />
          <span>Wan2.1 VACE Cloud GPU Active</span>
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
