import { env } from '../config/env.js';

/**
 * PART 8 — MEDIA URL NORMALIZER HELPER
 * Resolves relative backend paths like '/uploads/advertisements/video.mp4'
 * to absolute HTTP URLs pointing to the Express backend (e.g. 'http://localhost:5000/uploads/advertisements/video.mp4').
 */
export function getMediaUrl(path) {
  if (!path) return '';

  // Already absolute or data URI
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  // Get API base URL (e.g. 'http://localhost:5000/api/v1')
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000/api/v1';

  // Strip trailing '/api/v1' to get server root URL ('http://localhost:5000')
  const serverOrigin = apiUrl.replace(/\/api\/v1\/?$/, '');

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${serverOrigin}${cleanPath}`;
}
