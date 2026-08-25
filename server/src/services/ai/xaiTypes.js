export const XAI_VIDEO_PRICING = {
  'grok-imagine-video-1.5': {
    '720p': {
      6: 0.15,
      8: 0.20,
      10: 0.25,
    },
    '480p': {
      6: 0.10,
      8: 0.14,
      10: 0.18,
    },
    '1080p': {
      6: 0.25,
      8: 0.35,
      10: 0.45,
    },
  },
};

export const SUPPORTED_ASPECT_RATIOS = ['9:16', '1:1', '16:9'];
export const SUPPORTED_RESOLUTIONS = ['480p', '720p', '1080p'];
export const SUPPORTED_DURATIONS = [6, 8, 10];

export const PROMPT_PRESETS = [
  { id: 'showcase', label: 'Product Showcase', prompt: 'Create a crisp, cinematic 9:16 vertical commercial featuring this product. Smooth orbiting camera movement, studio rim lighting, macro focus on materials.' },
  { id: 'cinematic', label: 'Cinematic', prompt: 'Cinematic commercial style, dramatic lighting, anamorphic lens flare, slow motion 60fps, shallow depth of field, dark futuristic backdrop.' },
  { id: 'unboxing', label: 'Unboxing', prompt: 'First-person perspective product reveal, unwrapping packaging, smooth hands movement, bright clean studio lighting, realistic reflections.' },
  { id: 'lifestyle', label: 'Lifestyle', prompt: 'Warm organic sunlight, modern minimalist apartment setting, natural product usage demonstration, cozy lifestyle aesthetic.' },
  { id: 'luxury', label: 'Luxury', prompt: 'High-end luxury commercial, glossy dark reflective surface, gold and obsidian lighting accents, slow dramatic camera push-in.' },
  { id: 'gaming', label: 'Gaming', prompt: 'Futuristic gaming setup, neon cyan and magenta RGB lighting, smoke haze effect, high contrast, cybernetic aesthetic.' },
  { id: 'fashion', label: 'Fashion', prompt: 'Vogue editorial style, high fashion studio lighting, bold color contrast, smooth slow-motion camera pan.' },
  { id: 'minimal', label: 'Minimal', prompt: 'Clean monochrome background, soft diffused lighting, elegant product rotation, zero clutter, Scandinavian design aesthetic.' },
  { id: 'energetic', label: 'Energetic', prompt: 'Fast-paced commercial cuts, dynamic camera motion, strobe light flashes, high energy product presentation.' },
  { id: 'sale', label: 'Flash Sale', prompt: 'Eye-catching promotional video, vibrant accent lighting, dynamic zoom effect, commercial advertisement style.' },
];
