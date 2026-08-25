import React, { useState } from 'react';
import StudioHeader from './StudioHeader.jsx';
import LeftControlPanel from './LeftControlPanel.jsx';
import CenterVideoPreview from './CenterVideoPreview.jsx';
import RightProductPanel from './RightProductPanel.jsx';
import MyGenerationsTab from './MyGenerationsTab.jsx';
import ReelPublishModal from './ReelPublishModal.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';
import ErrorState from '../ui/ErrorState.jsx';

export const AIReelStudio = () => {
  const { activeTab, setIsPublishModalOpen } = useAIStudioStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-page text-text-primary transition-colors">
      {/* Studio Header */}
      <StudioHeader />

      {/* Main Workspace Body */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1536px] w-full mx-auto">
        {/* Error Notification if any */}
        {errorMessage && (
          <div className="mb-4">
            <ErrorState
              title="AI Generation Error"
              description={errorMessage}
              onRetry={() => setErrorMessage(null)}
              retryLabel="Dismiss Error"
            />
          </div>
        )}

        {/* Workspace Tab 1: AI GENERATE (3-Column Desktop / Responsive Mobile Workflow) */}
        {activeTab === 'AI GENERATE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT PANEL: Generation Controls & Prompt Box (4 Cols Desktop) */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <LeftControlPanel
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                onError={(msg) => setErrorMessage(msg)}
              />
            </div>

            {/* CENTER PANEL: 9:16 Phone Frame Video Preview (5 Cols Desktop) */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <CenterVideoPreview
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                onUseVideo={() => setIsPublishModalOpen(true)}
              />
            </div>

            {/* RIGHT PANEL: Product Commerce Details & Tag CTA (3 Cols Desktop) */}
            <div className="lg:col-span-3 order-3 lg:order-3">
              <RightProductPanel />
            </div>
          </div>
        )}

        {/* Workspace Tab 2: UPLOAD (Video File Upload Workflow) */}
        {activeTab === 'UPLOAD' && (
          <div className="max-w-2xl mx-auto my-8 p-8 bg-surface border border-border rounded-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center text-accent mx-auto">
              📁
            </div>
            <h3 className="text-lg font-bold text-text-primary">Upload Custom Reel Video</h3>
            <p className="text-xs text-text-muted">
              Select an MP4 or MOV video file from your device to attach products and publish.
            </p>
            <input type="file" accept="video/*" className="hidden" id="custom-video-upload" />
            <label htmlFor="custom-video-upload">
              <span className="inline-block px-5 py-2.5 bg-accent text-gray-950 font-bold text-xs rounded-lg cursor-pointer hover:bg-accent-hover shadow-sm">
                Choose Video File
              </span>
            </label>
          </div>
        )}

        {/* Workspace Tab 3: MY GENERATIONS (History Grid) */}
        {activeTab === 'MY GENERATIONS' && (
          <div className="max-w-6xl mx-auto">
            <MyGenerationsTab onUseVideo={() => setIsPublishModalOpen(true)} />
          </div>
        )}

        {/* Workspace Tab 4: TEMPLATES (AI Creative Templates) */}
        {activeTab === 'TEMPLATES' && (
          <div className="max-w-4xl mx-auto p-8 text-center bg-surface border border-border rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-text-primary">AI Video Templates</h3>
            <p className="text-xs text-text-muted">
              Pre-built high converting e-commerce templates (Unboxing, Flash Sale, Luxury Commercial, Lifestyle Review) coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Reel Draft Publishing Modal */}
      <ReelPublishModal />
    </div>
  );
};

export default AIReelStudio;
