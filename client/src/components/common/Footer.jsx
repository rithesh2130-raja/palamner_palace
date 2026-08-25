import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';

export const Footer = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      key: 'shop',
      title: 'Shop',
      links: [
        { label: 'All Products', path: '/products' },
        { label: 'Deals & Discounts', path: '/deals' },
        { label: 'Trending Reels', path: '/reels' },
        { label: 'Electronics', path: '/categories/electronics' },
        { label: 'Fashion & Apparel', path: '/categories/fashion' },
        { label: 'Gaming Gear', path: '/categories/gaming' },
      ],
    },
    {
      key: 'support',
      title: 'Customer Support',
      links: [
        { label: 'Help Center', path: '/support' },
        { label: 'Order Status', path: '/orders' },
        { label: 'Shipping & Delivery', path: '/shipping' },
        { label: 'Returns & Refunds', path: '/returns' },
        { label: 'Contact Us', path: '/contact' },
      ],
    },
    {
      key: 'creators',
      title: 'Creators',
      links: [
        { label: 'Creator Studio', path: '/creator/studio' },
        { label: 'Affiliate Program', path: '/creator/affiliate' },
        { label: 'Monetization Guidelines', path: '/creator/guidelines' },
        { label: 'Success Stories', path: '/creator/stories' },
      ],
    },
    {
      key: 'sellers',
      title: 'Sellers',
      links: [
        { label: 'Sell on ShopSphere', path: '/sell' },
        { label: 'Seller Dashboard', path: '/admin' },
        { label: 'Fulfillment Services', path: '/fulfillment' },
        { label: 'Seller Policies', path: '/seller-policies' },
      ],
    },
    {
      key: 'company',
      title: 'Company',
      links: [
        { label: 'About ShopSphere', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press & Media', path: '/press' },
        { label: 'Investor Relations', path: '/investors' },
      ],
    },
    {
      key: 'legal',
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Settings', path: '/cookies' },
        { label: 'Security Center', path: '/security' },
      ],
    },
  ];

  return (
    <footer className="bg-[#131A22] text-gray-300 pt-10 pb-20 lg:pb-10 border-t border-gray-800 text-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-gray-800 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-gray-950 font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              SHOPSPHERE
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            The next-generation social-commerce marketplace combining live creator video discovery with seamless shopping.
          </p>
        </div>

        {/* Desktop Columns Grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12">
          {sections.map((col) => (
            <div key={col.key}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Accordion Sections */}
        <div className="md:hidden space-y-3 pb-8">
          {sections.map((col) => (
            <div key={col.key} className="border-b border-gray-800 pb-2">
              <button
                onClick={() => toggleSection(col.key)}
                className="w-full py-2 flex items-center justify-between font-bold text-white text-sm"
              >
                <span>{col.title}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections[col.key] ? 'rotate-180 text-accent' : ''}`} />
              </button>
              {openSections[col.key] && (
                <ul className="mt-2 space-y-2 pl-2 pb-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.path} className="text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-400">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-400">Terms</Link>
            <Link to="/cookies" className="hover:text-gray-400">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
