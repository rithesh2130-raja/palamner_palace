import { create } from 'zustand';
import { mockProducts } from '../mock/index.js';

export const useAIStudioStore = create((set) => ({
  // Workspace Active Tab: 'AI GENERATE' | 'UPLOAD' | 'MY GENERATIONS' | 'TEMPLATES'
  activeTab: 'AI GENERATE',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Selected Commerce Product
  selectedProduct: mockProducts[0],
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // Generation Controls
  prompt: 'Create a cinematic 9:16 vertical commercial advertisement showing this product rotating slowly on a premium desk. Ultra high definition detail, studio rim lighting, shallow depth of field, realistic macro textures, smooth camera push-in.',
  setPrompt: (prompt) => set({ prompt }),
  
  stylePreset: 'Cinematic',
  setStylePreset: (stylePreset) => set({ stylePreset }),

  aspectRatio: '9:16',
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),

  duration: 6,
  setDuration: (duration) => set({ duration }),

  resolution: '720p',
  setResolution: (resolution) => set({ resolution }),

  // Active Job & Generation State
  currentJobId: null,
  setCurrentJobId: (jobId) => set({ currentJobId: jobId }),

  currentVideoUrl: null,
  setCurrentVideoUrl: (url) => set({ currentVideoUrl: url }),

  // Product Tag CTA: 'Shop Now' | 'View Product' | 'Buy Now' | 'Add to Cart'
  selectedCTA: 'Shop Now',
  setSelectedCTA: (cta) => set({ selectedCTA: cta }),

  // Reel Publishing Modal State
  isPublishModalOpen: false,
  setIsPublishModalOpen: (isOpen) => set({ isPublishModalOpen: isOpen }),

  // Reset Studio Form
  resetStudio: () =>
    set({
      currentJobId: null,
      currentVideoUrl: null,
      isPublishModalOpen: false,
    }),
}));

export default useAIStudioStore;
