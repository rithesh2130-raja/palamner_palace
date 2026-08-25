const API_BASE_URL = '/api/v1/ai';

export const generateVideo = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/videos/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to submit video generation request');
  }

  const result = await response.json();
  return result.data;
};

export const getGenerationJob = async (jobId) => {
  if (!jobId) return null;
  const response = await fetch(`${API_BASE_URL}/videos/jobs/${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to retrieve generation status');
  }
  const result = await response.json();
  return result.data;
};

export const cancelGeneration = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/videos/jobs/${jobId}/cancel`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to cancel job');
  return response.json();
};

export const enhancePrompt = async (prompt, productContext) => {
  const response = await fetch(`${API_BASE_URL}/prompts/enhance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, productContext }),
  });
  if (!response.ok) throw new Error('Failed to enhance prompt');
  const result = await response.json();
  return result.data.enhancedPrompt;
};

export const getGenerationHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/videos/history`);
  if (!response.ok) throw new Error('Failed to load history');
  const result = await response.json();
  return result.data;
};

export const getAdminAIAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) throw new Error('Failed to load analytics');
  const result = await response.json();
  return result.data;
};

export const publishReelDraft = async (reelData) => {
  const response = await fetch('/api/v1/reels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reelData),
  });
  if (!response.ok) throw new Error('Failed to publish Reel');
  return response.json();
};
