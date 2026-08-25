import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGenerationHistory } from '../../services/aiVideoApi.js';
import Card, { CardContent } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';
import { Play, Check, RotateCcw, Clock } from 'lucide-react';

export const MyGenerationsTab = ({ onUseVideo }) => {
  const { setCurrentVideoUrl, setIsPublishModalOpen, setPrompt } = useAIStudioStore();

  const { data: history, isLoading, error } = useQuery({
    queryKey: ['aiGenerationHistory'],
    queryFn: getGenerationHistory,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <Spinner size="lg" />
        <p className="text-xs text-text-muted">Loading your AI generation history...</p>
      </div>
    );
  }

  if (error || !history || history.length === 0) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-2xl space-y-3">
        <Clock className="w-10 h-10 text-accent mx-auto" />
        <h3 className="text-base font-bold text-text-primary">No AI Generations Found</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          You haven't generated any AI Reels yet. Use the "AI Generate" tab to create your first video!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Recent AI Generations ({history.length})
        </h3>
        <Badge variant="prime" size="sm">grok-imagine-video-1.5</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((job) => {
          const isDone = job.status === 'COMPLETED';
          return (
            <Card key={job._id || job.id} variant="default" className="flex flex-col overflow-hidden">
              <div className="relative aspect-[9/16] bg-gray-950 overflow-hidden group">
                {job.outputVideoUrl ? (
                  <video src={job.outputVideoUrl} className="w-full h-full object-cover" />
                ) : job.thumbnailUrl ? (
                  <img src={job.thumbnailUrl} alt={job.prompt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-gray-900">
                    No Preview
                  </div>
                )}

                <div className="absolute top-2 left-2 z-10">
                  <Badge
                    variant={isDone ? 'success' : job.status === 'FAILED' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {job.status}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-pill bg-black/60 text-white backdrop-blur-xs">
                    {job.duration || 6}s • {job.resolution || '720p'}
                  </span>
                </div>
              </div>

              <CardContent className="p-3 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <p className="text-xs text-text-primary font-medium line-clamp-2">{job.prompt}</p>
                  <span className="text-[10px] text-text-muted mt-1 block">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {isDone && job.outputVideoUrl && (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="primary"
                      fullWidth
                      icon={Check}
                      onClick={() => {
                        setCurrentVideoUrl(job.outputVideoUrl);
                        if (onUseVideo) onUseVideo(job);
                        else setIsPublishModalOpen(true);
                      }}
                      className="text-xs font-bold"
                    >
                      Use
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={RotateCcw}
                      onClick={() => setPrompt(job.prompt)}
                      className="text-xs"
                      title="Reuse prompt"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyGenerationsTab;
