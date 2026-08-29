export const categories = [
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets, laptops, smartphones, keyboards & audio gear.',
    subcategories: ['Laptops', 'Mobiles', 'Keyboards', 'Headphones', 'Accessories'],
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    description: 'Trending ethnic wear, traditional sarees, modern apparel & footwear.',
    subcategories: ['Ethnic Wear', 'Western', 'Footwear', 'Accessories'],
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    description: 'Ayurvedic face serums, gold skincare, organic cosmetics & fragrances.',
    subcategories: ['Skincare', 'Ayurvedic', 'Makeup', 'Haircare'],
  },
  {
    slug: 'home',
    name: 'Home',
    description: 'Brass handcrafted decor, royal lamps, kitchenware & festive items.',
    subcategories: ['Decor', 'Handicraft', 'Lighting', 'Kitchen'],
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    description: 'High performance gaming mice, mechanical keyboards & audio setups.',
    subcategories: ['Peripherals', 'Keyboards', 'Mice', 'Headsets'],
  },
  {
    slug: 'sports',
    name: 'Sports',
    description: 'Pro graphite badminton rackets, fitness accessories & sports equipment.',
    subcategories: ['Badminton', 'Fitness', 'Equipment', 'Outdoor'],
  },
];

export const getCategoryBySlug = (slug = '') => {
  const norm = String(slug).toLowerCase().trim();
  return categories.find(cat => cat.slug === norm) || null;
};

export default categories;
