import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShoppingCart,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ShoppingBag,
  Eye,
} from 'lucide-react';
import Drawer from '../ui/Drawer.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Badge from '../ui/Badge.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import reelService from '../../services/api/reelApi.js';

export const ReelShell = ({ reel, isActive = true }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(reel?.isLiked || false);
  const [likesCount, setLikesCount] = useState(reel?.likesCount || 0);
  const [isSaved, setIsSaved] = useState(reel?.isSaved || false);
  const [savesCount, setSavesCount] = useState(reel?.savesCount || 0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [commentsList, setCommentsList] = useState(
    reel?.comments || [
      { id: 1, userName: 'fashion_fanatic', text: 'Stunning quality! Absolutely love this piece ✨', createdAt: new Date() },
      { id: 2, userName: 'shopaholic_99', text: 'Does it come with free delivery to Palamaner?', createdAt: new Date() },
    ]
  );

  // Sync state when reel prop changes
  useEffect(() => {
    if (reel) {
      setIsLiked(reel.isLiked || false);
      setLikesCount(reel.likesCount || 0);
      setIsSaved(reel.isSaved || false);
      setSavesCount(reel.savesCount || 0);
      setCommentsList(
        reel.comments && reel.comments.length > 0
          ? reel.comments
          : [
              { id: 1, userName: 'fashion_fanatic', text: 'Stunning quality! Absolutely love this piece ✨', createdAt: new Date() },
              { id: 2, userName: 'shopaholic_99', text: 'Does it come with free delivery to Palamaner?', createdAt: new Date() },
            ]
      );
    }
  }, [reel]);

  // Handle Video Auto-Play on Active Slide
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
        reelService.recordView(reel?.id || reel?._id);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, reel]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (reel?.id || reel?._id) {
        await reelService.toggleLike(reel.id || reel._id);
      }
    } catch (err) {
      console.error('Like toggle failed:', err);
    }
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    const nextState = !isSaved;
    setIsSaved(nextState);
    setSavesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    addToast(nextState ? 'Reel saved to your bookmarks!' : 'Removed from saved reels.', 'info');

    try {
      if (reel?.id || reel?._id) {
        await reelService.toggleSave(reel.id || reel._id);
      }
    } catch (err) {
      console.error('Save toggle failed:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    const commentObj = {
      id: Date.now(),
      userName: 'You',
      text: newComment.trim(),
      createdAt: new Date(),
    };

    setCommentsList((prev) => [...prev, commentObj]);
    setNewComment('');

    try {
      if (reel?.id || reel?._id) {
        await reelService.addComment(reel.id || reel._id, commentObj.text);
      }
    } catch (err) {
      console.error('Add comment failed:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const product = reel?.taggedProduct || reel?.product;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!product) return;
    const prodId = product.id || product._id || product.productId;
    await addToCart(prodId, 1);
    addToast(`Added "${product.title || product.name}" to cart!`, 'success');
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    if (!product) return;
    const prodId = product.id || product._id || product.productId;
    await addToCart(prodId, 1);
    setIsProductDrawerOpen(false);
    navigate('/checkout');
  };

  const videoSrc = reel?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-a-saree-41473-large.mp4';
  const posterSrc = reel?.videoPoster || reel?.thumbnailUrl || reel?.thumbnail;

  const creatorName = reel?.creator?.name || reel?.creator?.displayName || 'ShopSphere Official';
  const creatorHandle = reel?.creator?.handle || (reel?.creator?.username ? `@${reel.creator.username}` : '@shopsphere');
  const creatorAvatar = reel?.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={togglePlayPause}
      className="relative w-full max-w-md h-[calc(100vh-110px)] sm:h-[750px] mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-between select-none cursor-pointer group"
    >
      {/* Background HTML5 Video / Thumbnail Fallback */}
      <div className="absolute inset-0 z-0 bg-gray-950 flex items-center justify-center">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={posterSrc}
            alt={reel?.caption || 'Reel video'}
            className="w-full h-full object-cover"
          />
        )}

        {/* Dark Contrast Gradients for Top & Bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />

        {/* Play/Pause Center Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-accent/90 text-gray-950 flex items-center justify-center shadow-2xl pl-1">
              <Play className="w-8 h-8 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Top Bar Controls */}
      <div className="relative z-10 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Badge variant="deal" size="sm">LIVE REEL</Badge>
          <span className="text-xs font-bold text-gray-200 drop-shadow">ShopSphere Visual Feed</span>
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-colors shadow-lg"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Bottom Content & Right Action Panel */}
      <div className="relative z-10 p-4 flex items-end justify-between gap-3 text-white">
        {/* LEFT COLUMN: Creator Profile, Caption, Tagged Product Card */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 pr-2">
          {/* Creator Profile */}
          <div className="flex items-center gap-2.5">
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-10 h-10 rounded-full border-2 border-accent object-cover shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white drop-shadow">
                  {creatorHandle}
                </span>
                {reel?.creator?.verified !== false && (
                  <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                )}
              </div>
              <span className="text-[11px] text-gray-300 drop-shadow">
                {creatorName}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFollowing(!isFollowing);
              }}
              className={`ml-2 px-3 py-1 text-xs font-extrabold rounded-full transition-all ${
                isFollowing
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-accent text-gray-950 hover:bg-accent-hover'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs sm:text-sm text-gray-100 font-medium line-clamp-2 drop-shadow-md">
            {reel?.caption}
          </p>

          {/* Tagged Product Card Banner */}
          {product && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsProductDrawerOpen(true);
              }}
              className="p-2.5 rounded-xl bg-gray-900/90 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-900 transition-colors shadow-2xl group/card"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={product.image || 'https://via.placeholder.com/60'}
                  alt={product.title || product.name}
                  className="w-11 h-11 rounded-lg object-cover border border-white/20 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate group-hover/card:text-accent transition-colors">
                    {product.title || product.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-accent">
                      ₹{(product.price || 0).toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                className="shrink-0 font-extrabold text-xs py-1.5 px-3"
                onClick={handleBuyNow}
              >
                BUY NOW
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT ACTION COLUMN */}
        <div className="flex flex-col items-center gap-4 text-white shrink-0">
          {/* Like */}
          <button
            type="button"
            onClick={handleToggleLike}
            className="flex flex-col items-center gap-1 group/btn"
            aria-label="Like video"
          >
            <div
              className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 transition-all group-active/btn:scale-125 ${
                isLiked ? 'text-red-500 bg-red-500/20 border-red-500/40' : 'text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold drop-shadow">{likesCount.toLocaleString('en-IN')}</span>
          </button>

          {/* Comments */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentsOpen(true);
            }}
            className="flex flex-col items-center gap-1 group/btn"
            aria-label="Open comments"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white transition-all group-active/btn:scale-125">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold drop-shadow">
              {(reel?.commentsCount || commentsList.length).toLocaleString('en-IN')}
            </span>
          </button>

          {/* Save / Bookmark */}
          <button
            type="button"
            onClick={handleToggleSave}
            className="flex flex-col items-center gap-1 group/btn"
            aria-label="Bookmark reel"
          >
            <div
              className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 transition-all group-active/btn:scale-125 ${
                isSaved ? 'text-accent bg-accent/20 border-accent/40' : 'text-white'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold drop-shadow">{savesCount.toLocaleString('en-IN')}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="flex flex-col items-center gap-1 group/btn"
            aria-label="Share video"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white transition-all group-active/btn:scale-125">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold drop-shadow">{(reel?.sharesCount || 0).toLocaleString('en-IN')}</span>
          </button>

          {/* Shop Tagged Product Drawer Trigger */}
          {product && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsProductDrawerOpen(true);
              }}
              className="flex flex-col items-center gap-1 group/btn"
              aria-label="Shop tagged product"
            >
              <div className="p-3 rounded-full bg-accent text-gray-950 font-bold transition-transform group-hover/btn:scale-110 shadow-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-accent drop-shadow uppercase tracking-wider">Shop</span>
            </button>
          )}
        </div>
      </div>

      {/* COMMENTS DRAWER */}
      <Drawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title={`Comments (${commentsList.length})`}
        position="bottom"
      >
        <div className="flex flex-col h-[350px]" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {commentsList.map((c, idx) => (
              <div key={c.id || idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-secondary/60">
                <div className="w-7 h-7 rounded-full bg-accent text-gray-950 font-bold text-xs flex items-center justify-center shrink-0">
                  {(c.userName || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">@{c.userName || 'User'}</span>
                    <span className="text-[10px] text-text-tertiary">
                      {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="pt-3 border-t border-border flex items-center gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="h-10 text-xs"
            />
            <Button type="submit" variant="primary" size="sm" icon={Send} disabled={isSubmittingComment}>
              Post
            </Button>
          </form>
        </div>
      </Drawer>

      {/* SHARE DRAWER */}
      <Drawer
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Social Reel"
        position="bottom"
      >
        <div className="space-y-4 py-2" onClick={(e) => e.stopPropagation()}>
          <p className="text-xs text-text-secondary">Share this video with friends and social channels:</p>
          <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addToast('Reel link copied to clipboard!', 'success');
                setIsShareOpen(false);
              }}
              className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2"
            >
              <Share2 className="w-5 h-5 text-accent" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={() => {
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`, '_blank');
                setIsShareOpen(false);
              }}
              className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setIsShareOpen(false)}
              className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Instagram</span>
            </button>
            <button
              onClick={() => setIsShareOpen(false)}
              className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2"
            >
              <Heart className="w-5 h-5 text-red-500" />
              <span>Embed</span>
            </button>
          </div>
        </div>
      </Drawer>

      {/* PRODUCT DRAWER */}
      {product && (
        <Drawer
          isOpen={isProductDrawerOpen}
          onClose={() => setIsProductDrawerOpen(false)}
          title="Tagged Product"
          position="bottom"
        >
          <div className="space-y-4 py-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-4 items-center">
              <img
                src={product.image || 'https://via.placeholder.com/100'}
                alt={product.title || product.name}
                className="w-20 h-20 rounded-xl object-cover border border-border"
              />
              <div className="flex-1 space-y-1">
                <Badge variant="deal">{product.discount || 'Featured Product'}</Badge>
                <h3 className="font-extrabold text-sm text-text-primary">{product.title || product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-accent">
                    ₹{(product.price || 0).toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-text-tertiary line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button fullWidth variant="outline" icon={ShoppingCart} onClick={handleAddToCart}>
                ADD TO CART
              </Button>
              <Button fullWidth variant="primary" icon={ShoppingBag} onClick={handleBuyNow}>
                BUY NOW
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default ReelShell;
