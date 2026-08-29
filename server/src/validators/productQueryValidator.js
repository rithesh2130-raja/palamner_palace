/**
 * Product Query Validator & Sanitizer
 * Protects against MongoDB injection and enforces query parameter constraints.
 */

const ALLOWED_SORT_OPTIONS = [
  'relevance',
  'price_asc',
  'price_desc',
  'newest',
  'rating',
  'popular',
];

const SORT_ALIAS_MAP = {
  'price-low': 'price_asc',
  'price_low': 'price_asc',
  'price-high': 'price_desc',
  'price_high': 'price_desc',
  'new': 'newest',
  'bestsellers': 'popular',
  'bestseller': 'popular',
};

/**
 * Validates and normalizes raw express req.query object.
 * @param {Record<string, any>} rawQuery
 */
export function validateProductQuery(rawQuery = {}) {
  // Extract and normalize string query inputs
  const qRaw = rawQuery.q !== undefined ? rawQuery.q : rawQuery.search;
  const q = typeof qRaw === 'string' ? qRaw.trim() : '';

  const category = typeof rawQuery.category === 'string' ? rawQuery.category.trim() : '';
  const subcategory = typeof rawQuery.subcategory === 'string' ? rawQuery.subcategory.trim() : '';
  const brand = typeof rawQuery.brand === 'string' ? rawQuery.brand.trim() : '';

  // Parse numeric values safely
  let page = parseInt(rawQuery.page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  let limit = parseInt(rawQuery.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = 20;
  } else if (limit > 100) {
    limit = 100;
  }

  let minPrice;
  if (rawQuery.minPrice !== undefined && rawQuery.minPrice !== '') {
    const parsedMin = Number(rawQuery.minPrice);
    if (!isNaN(parsedMin) && parsedMin >= 0) {
      minPrice = parsedMin;
    }
  }

  let maxPrice;
  if (rawQuery.maxPrice !== undefined && rawQuery.maxPrice !== '') {
    const parsedMax = Number(rawQuery.maxPrice);
    if (!isNaN(parsedMax) && parsedMax >= 0) {
      maxPrice = parsedMax;
    }
  }

  if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
    const temp = minPrice;
    minPrice = maxPrice;
    maxPrice = temp;
  }

  let minRating;
  if (rawQuery.minRating !== undefined && rawQuery.minRating !== '') {
    const parsedRating = Number(rawQuery.minRating);
    if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
      minRating = parsedRating;
    }
  }

  const inStock = rawQuery.inStock === 'true' || rawQuery.inStock === true;
  const isFeatured = rawQuery.isFeatured === 'true' || rawQuery.isFeatured === true ? true : undefined;

  // Sorting whitelist resolution
  let sortInput = typeof rawQuery.sort === 'string' ? rawQuery.sort.trim().toLowerCase() : '';
  if (SORT_ALIAS_MAP[sortInput]) {
    sortInput = SORT_ALIAS_MAP[sortInput];
  }

  let sort = ALLOWED_SORT_OPTIONS.includes(sortInput) ? sortInput : (q ? 'relevance' : 'newest');

  return {
    q,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    isFeatured,
    sort,
    page,
    limit,
  };
}

export default validateProductQuery;
