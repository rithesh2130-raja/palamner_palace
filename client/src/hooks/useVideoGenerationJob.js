import { useQuery } from '@tanstack/react-query';
import { getGenerationJob } from '../services/aiVideoApi.js';

export const useVideoGenerationJob = (jobId) => {
  return useQuery({
    queryKey: ['aiVideoJob', jobId],
    queryFn: () => getGenerationJob(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 3000;
      // Stop polling when in terminal state
      if (['COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(data.status)) {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
    refetchIntervalInBackground: false,
    staleTime: 1000,
  });
};

export default useVideoGenerationJob;
