import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import Section from '../../components/common/Section.jsx';
import Card, { CardContent } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import ReelShell from '../../components/reels/ReelShell.jsx';
import { mockProducts, mockReels, mockCategories } from '../../mock/index.js';
import { Sparkles, Flame, Play, ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER PLACEHOLDER */}
      <section className="bg-gradient-to-r from-gray-900 via-primary to-primary-secondary text-white py-12 px-6 rounded-2xl shadow-xl relative overflow-hidden my-6 border border-gray-800">
        <div className="max-w-3xl space-y-4 relative z-10">
          <Badge variant="deal" size="lg" className="shadow-md">
            SHOPPING MEETS SOCIAL REELS
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Watch Creator Reels & <span className="text-accent">Shop Instantly</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl">
            Explore thousands of authentic video reviews, trending gaming gear, minimalist fashion, and daily deals with instant 1-click checkout.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/reels">
              <Button size="lg" variant="primary" icon={Play} className="font-extrabold shadow-lg">
                Explore Reels Feed
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="text-white border-gray-600 hover:bg-white/10 font-bold">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PageContainer>
        {/* 2. CATEGORY TILES PLACEHOLDER */}
        <Section title="Shop by Category" subtitle="Discover trending collections across top departments">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {mockCategories.map((cat) => (
              <Link key={cat.id} to={`/categories/${cat.name.toLowerCase()}`}>
                <Card variant="interactive" className="p-4 text-center flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-text-muted">{cat.count.toLocaleString()} items</span>
                </Card>
              </Link>
            ))}
          </div>
        </Section>

        {/* 3. TRENDING REELS SHOWCASE */}
        <Section
          title="Trending Creator Reels"
          subtitle="Real people, real products, authentic reviews"
          action={
            <Link to="/reels" className="text-accent hover:underline text-sm font-bold flex items-center gap-1">
              View All Reels <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReels.slice(0, 3).map((reel) => (
              <div key={reel.id} className="flex justify-center">
                <ReelShell reel={reel} />
              </div>
            ))}
          </div>
        </Section>

        {/* 4. TODAY'S HOT DEALS */}
        <Section
          title="Today's Flash Deals"
          subtitle="Limited time discounts on top-rated products"
          action={
            <Link to="/deals" className="text-accent hover:underline text-sm font-bold flex items-center gap-1">
              All Deals <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mockProducts.slice(0, 4).map((product) => (
              <Card key={product.id} variant="interactive" className="flex flex-col group">
                <div className="relative aspect-square overflow-hidden bg-surface-secondary">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="deal">{product.badge}</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 flex flex-col justify-between p-4 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <h3 className="font-semibold text-sm text-text-primary line-clamp-2 mt-0.5 group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-lg font-extrabold text-accent">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <Button size="sm" variant="primary" className="font-bold text-xs">
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* 5. VALUE PROPOSITION FOOTER STRIP */}
        <div className="mt-12 p-6 rounded-xl bg-surface border border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-8 h-8 text-accent" />
            <h4 className="font-bold text-sm text-text-primary">Free Express Delivery</h4>
            <p className="text-xs text-text-muted">On eligible orders over ₹499</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <h4 className="font-bold text-sm text-text-primary">100% Authentic Guarantee</h4>
            <p className="text-xs text-text-muted">Direct from verified sellers & creators</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-accent" />
            <h4 className="font-bold text-sm text-text-primary">Easy 7-Day Returns</h4>
            <p className="text-xs text-text-muted">Hassle-free replacement policy</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Award className="w-8 h-8 text-accent" />
            <h4 className="font-bold text-sm text-text-primary">Creator Verified Reviews</h4>
            <p className="text-xs text-text-muted">Watch video proof before buying</p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default HomePage;
