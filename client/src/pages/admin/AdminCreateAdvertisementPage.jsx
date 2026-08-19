import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/api/productApi.js';
import { advertisementService } from '../../services/api/advertisementApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Sparkles, Wand2, Film, Play, CheckCircle2, RefreshCw, ArrowLeft, Send } from 'lucide-react';

export const AdminCreateAdvertisementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [objective, setObjective] = useState('Product Launch');
  const [targetAudience, setTargetAudience] = useState('General Shoppers');
  const [tone, setTone] = useState('Energetic');
  const [visualStyle, setVisualStyle] = useState('Cinematic');
  const [callToAction, setCallToAction] = useState('Shop Now');
  const [duration, setDuration] = useState('8 seconds');
  const [aspectRatio, setAspectRatio] = useState('9:16');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedAd, setGeneratedAd] = useState(null);

  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    productService.getProducts().then((prods) => {
      setProducts(prods);
      if (prods.length > 0) {
        setSelectedProductId(prods[0].id);
        setSelectedProduct(prods[0]);
      }
    });
  }, []);

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
    const prod = products.find((p) => p.id === id);
    setSelectedProduct(prod);
  };

  const handleGenerateAd = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      showToast('Please select a product first', 'error');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Analyzing product details & image...');

    try {
      setTimeout(() => setGenerationStep('Building visual prompt & camera directions...'), 400);
      setTimeout(() => setGenerationStep('Calling Gemini Omni Flash video engine...'), 800);

      const result = await advertisementService.generateAdvertisement({
        product: selectedProduct,
        objective,
        targetAudience,
        tone,
        visualStyle,
        callToAction,
        duration,
        aspectRatio,
      });

      setGeneratedAd(result.data);
      showToast('AI Advertisement generated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to generate advertisement', 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleApplyEdit = async () => {
    if (!editInstruction.trim() || !generatedAd) return;
    setIsEditing(true);
    try {
      const result = await advertisementService.editAdvertisement(
        generatedAd._id || generatedAd.id,
        editInstruction
      );
      setGeneratedAd(result.data);
      setEditInstruction('');
      showToast('AI Edit applied to advertisement!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to apply AI edit', 'error');
    } finally {
      setIsEditing(false);
    }
  };

  const handlePublishAsReel = async () => {
    if (!generatedAd) return;
    try {
      const result = await advertisementService.publishAdvertisementAsReel(
        generatedAd._id || generatedAd.id
      );
      showToast('Published as shoppable Reel! 🎬', 'success');
      navigate('/reels');
    } catch (err) {
      showToast(err.message || 'Failed to publish reel', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <button
            onClick={() => navigate('/admin/advertisements')}
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Advertisements
          </button>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#E50914]" />
            <span>AI ADVERTISEMENT STUDIO</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Create scroll-stopping vertical 9:16 product advertisements using Google's Gemini Omni Flash.
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleGenerateAd} className="space-y-5">
            {/* Product Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Select Catalog Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E50914]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — ₹{p.price} ({p.brand})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product Quick Card */}
            {selectedProduct && (
              <div className="p-3 bg-black border border-neutral-800 rounded-xl flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-700"
                />
                <div className="text-xs">
                  <div className="font-bold text-white">{selectedProduct.title}</div>
                  <div className="text-neutral-400">
                    Price: ₹{selectedProduct.price} • Brand: {selectedProduct.brand}
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Objective & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Campaign Objective</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option value="Product Launch">Product Launch</option>
                  <option value="Flash Sale">Flash Sale</option>
                  <option value="Discount Promotion">Discount Promotion</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Festival Campaign">Festival Campaign</option>
                  <option value="Limited Stock">Limited Stock</option>
                  <option value="Clearance Sale">Clearance Sale</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option value="Energetic">Energetic</option>
                  <option value="Premium">Premium</option>
                  <option value="Minimal">Minimal</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Youthful">Youthful</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emotional">Emotional</option>
                  <option value="Modern">Modern</option>
                </select>
              </div>
            </div>

            {/* Visual Style & CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Visual Style</label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Minimal Product Showcase">Minimal Product Showcase</option>
                  <option value="Luxury Commercial">Luxury Commercial</option>
                  <option value="Fast-Paced Social Ad">Fast-Paced Social Ad</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Studio Product Shot">Studio Product Shot</option>
                  <option value="Festival Promotion">Festival Promotion</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Call to Action (CTA)</label>
                <select
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option value="Shop Now">Shop Now</option>
                  <option value="Buy Now">Buy Now</option>
                  <option value="Explore Now">Explore Now</option>
                  <option value="Limited Time Offer">Limited Time Offer</option>
                  <option value="Get Yours Today">Get Yours Today</option>
                  <option value="Discover More">Discover More</option>
                </select>
              </div>
            </div>

            {/* Duration & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option value="5 seconds">5 seconds</option>
                  <option value="8 seconds">8 seconds</option>
                  <option value="10 seconds">10 seconds</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Aspect Ratio</label>
                <input
                  type="text"
                  value={aspectRatio}
                  readOnly
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-400 font-bold"
                />
              </div>
            </div>

            {/* Generate CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-red-600/30"
              isLoading={isGenerating}
            >
              <Sparkles className="w-5 h-5" />
              <span>GENERATE ADVERTISEMENT</span>
            </Button>
          </form>
        </div>

        {/* Right Column: Preview & AI Editing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-[#E50914]" />
              <span>Advertisement Preview (9:16)</span>
            </h3>

            {isGenerating ? (
              <div className="w-full aspect-[9/16] bg-black rounded-2xl border border-neutral-800 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-pulse">
                <Wand2 className="w-10 h-10 text-[#E50914] animate-bounce" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">AI IS CREATING YOUR AD</h4>
                  <p className="text-xs text-neutral-400">{generationStep}</p>
                </div>
              </div>
            ) : generatedAd ? (
              <div className="space-y-4">
                {/* Preview Video Box */}
                <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto bg-black rounded-2xl overflow-hidden border-2 border-[#E50914] shadow-2xl group">
                  <img
                    src={generatedAd.videoUrl || generatedAd.thumbnailUrl || selectedProduct?.image}
                    alt="Ad Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none"></div>

                  <div className="absolute top-3 left-3 bg-[#E50914] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {generatedAd.objective}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                    <div className="text-xs font-bold">{selectedProduct?.title}</div>
                    <button
                      onClick={handlePublishAsReel}
                      className="w-full py-2 bg-[#E50914] text-white font-bold text-xs rounded-lg shadow uppercase tracking-wider"
                    >
                      {generatedAd.callToAction || 'Shop Now'}
                    </button>
                  </div>
                </div>

                {/* Conversational AI Editing */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <label className="block text-xs font-bold text-white">Conversational AI Edit</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tell AI what to change (e.g. Make lighting dramatic)..."
                      value={editInstruction}
                      onChange={(e) => setEditInstruction(e.target.value)}
                      className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                    <button
                      onClick={handleApplyEdit}
                      disabled={isEditing || !editInstruction.trim()}
                      className="p-2 bg-[#E50914] hover:bg-[#B20710] text-white rounded-xl transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAd}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handlePublishAsReel}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish Reel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[9/16] bg-black rounded-2xl border border-neutral-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <Film className="w-10 h-10 text-neutral-600" />
                <p className="text-xs text-neutral-400">
                  Fill out the advertisement options on the left and click <strong>Generate Advertisement</strong> to view real-time 9:16 AI video rendering.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
