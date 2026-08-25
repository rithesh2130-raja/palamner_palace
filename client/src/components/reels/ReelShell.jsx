import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, ShoppingCart, Check, Send, Sparkles } from 'lucide-react';
import Drawer from '../ui/Drawer.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Badge from '../ui/Badge.jsx';
import { mockReels } from '../../mock/index.js';

export const ReelShell = ({ reel = mockReels[0] }) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked || false);
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [isSaved, setIsSaved] = useState(reel.isSaved || false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [commentsList, setCommentsList] = useState([
    { id: 1, user: 'game_master99', text: 'Does this headset work with PS5?', time: '2h ago' },
    { id: 2, user: 'techie_dev', text: 'Audio quality is insane for this price tag!', time: '1h ago' },
    { id: 3, user: 'sam_vlog', text: 'Just ordered mine! Excited to test it out.', time: '30m ago' },
  ]);

  const handleToggleLike = () => {
    setIsLiked((prev) => {
      setLikesCount((cnt) => (prev ? cnt - 1 : cnt + 1));
      return !prev;
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentsList((prev) => [
      ...prev,
      { id: Date.now(), user: 'You', text: newComment, time: 'Just now' },
    ]);
    setNewComment('');
  };

  return (
    <div className="relative w-full max-w-md h-[calc(100vh-110px)] sm:h-[750px] mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-between select-none">
      {/* Background Video / Image Thumbnail */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <img
          src={reel.thumbnail}
          alt={reel.caption}
          className="w-full h-full object-cover"
        />
        {/* Top & Bottom Overlay Gradient Contrast for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Top Bar Header */}
      <div className="relative z- sticky top-0 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Badge variant="deal" size="sm">LIVE REEL</Badge>
          <span className="text-xs font-semibold text-gray-300">ShopSphere Visual Feed</span>
        </div>
      </div>

      {/* Bottom Main Content & Right Action Column */}
      <div className="relative z- sticky bottom-0 p-4 flex items-end justify-between gap-3 text-white">
        {/* LEFT COLUMN: Creator Info, Caption, Hashtags, Tagged Product Card */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 pr-2">
          {/* Creator Profile & Follow */}
          <div className="flex items-center gap-2.5">
            <img
              src={reel.creator.avatar}
              alt={reel.creator.username}
              className="w-10 h-10 rounded-full border-2 border-accent object-cover shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white drop-shadow">
                  @{reel.creator.username}
                </span>
                {reel.creator.verified && (
                  <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                )}
              </div>
              <span className="text-[11px] text-gray-300 drop-shadow">
                {reel.creator.displayName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsFollowing(!isFollowing)}
              className={`ml-2 px-3 py-1 text-xs font-bold rounded-pill transition-all ${
                isFollowing
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-accent text-gray-950 hover:bg-accent-hover'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Caption & Hashtags */}
          <p className="text-xs sm:text-sm text-gray-100 font-medium line-clamp-2 drop-shadow-md">
            {reel.caption}
          </p>

          {/* Tagged Product Preview Card */}
          {reel.product && (
            <div
              onClick={() => setIsProductDrawerOpen(true)}
              className="p-2.5 rounded-xl bg-gray-900/85 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-900 transition-colors shadow-lg group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={reel.product.image}
                  alt={reel.product.title}
                  className="w-11 h-11 rounded-lg object-cover border border-white/20 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate group-hover:text-accent transition-colors">
                    {reel.product.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-accent">
                      ₹{reel.product.price.toLocaleString()}
                    </span>
                    {reel.product.originalPrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{reel.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="primary" className="shrink-0 font-bold text-xs py-1 px-3">
                SHOP NOW
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT ACTION COLUMN */}
        <div className="flex flex-col items-center gap-4 text-white shrink-0">
          {/* Like */}
          <button
            onClick={handleToggleLike}
            className="flex flex-col items-center gap-1 group"
            aria-label="Like video"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-transform group-active:scale-125 ${isLiked ? 'text-social-like' : 'text-white'}`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-xs font-bold drop-shadow">{likesCount.toLocaleString()}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Open comments"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-transform group-active:scale-125">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold drop-shadow">{reel.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Share video"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-transform group-active:scale-125">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold drop-shadow">{reel.sharesCount}</span>
          </button>

          {/* Save / Bookmark */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Bookmark reel"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-transform group-active:scale-125 ${isSaved ? 'text-accent' : 'text-white'}`}>
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </div>
            <span className="text-xs font-bold drop-shadow">{reel.savesCount}</span>
          </button>

          {/* Shop Tagged Product Quick Trigger */}
          <button
            onClick={() => setIsProductDrawerOpen(true)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Shop tagged product"
          >
            <div className="p-3 rounded-full bg-accent text-gray-950 font-bold transition-transform group-hover:scale-110 shadow-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-accent drop-shadow uppercase tracking-wider">Shop</span>
          </button>
        </div>
      </div>

      {/* COMMENTS DRAWER */}
      <Drawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title={`Comments (${commentsList.length})`}
        position="bottom"
      >
        <div className="flex flex-col h-[350px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {commentsList.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-secondary/60">
                <div className="w-7 h-7 rounded-full bg-accent text-gray-950 font-bold text-xs flex items-center justify-center shrink-0">
                  {c.user[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">@{c.user}</span>
                    <span className="text-[10px] text-text-muted">{c.time}</span>
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
            <Button type="submit" variant="primary" size="sm" icon={Send}>
              Post
            </Button>
          </form>
        </div>
      </Drawer>

      {/* SHARE DRAWER */}
      <Drawer
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Reel"
        position="bottom"
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-text-muted">Spread the word about this reel across your network:</p>
          <div className="grid grid-cols-4 gap-3 text-center text-xs font-semibold">
            <button className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2">
              <Share2 className="w-5 h-5 text-accent" />
              <span>Copy Link</span>
            </button>
            <button className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              <span>WhatsApp</span>
            </button>
            <button className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Instagram</span>
            </button>
            <button className="p-3 rounded-xl bg-surface-secondary hover:bg-border flex flex-col items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Embed</span>
            </button>
          </div>
        </div>
      </Drawer>

      {/* PRODUCT DRAWER */}
      {reel.product && (
        <Drawer
          isOpen={isProductDrawerOpen}
          onClose={() => setIsProductDrawerOpen(false)}
          title="Tagged Product"
          position="bottom"
        >
          <div className="space-y-4 py-2">
            <div className="flex gap-4 items-center">
              <img
                src={reel.product.image}
                alt={reel.product.title}
                className="w-24 h-24 rounded-lg object-cover border border-border"
              />
              <div className="flex-1 space-y-1">
                <Badge variant="deal">{reel.product.badge || 'Featured'}</Badge>
                <h3 className="font-bold text-sm text-text-primary">{reel.product.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-accent">₹{reel.product.price.toLocaleString()}</span>
                  {reel.product.originalPrice && (
                    <span className="text-xs text-text-muted line-through">₹{reel.product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{reel.product.description}</p>
            <div className="flex gap-3 pt-2">
              <Button fullWidth variant="outline" onClick={() => setIsProductDrawerOpen(false)}>
                View Details
              </Button>
              <Button fullWidth variant="primary">
                Add to Cart
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default ReelShell;
