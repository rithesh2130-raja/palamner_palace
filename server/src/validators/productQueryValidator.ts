/**
 * Product Query Validator & Sanitizer (TypeScript)
 */

export interface ValidatedProductQuery {
  q: string;
  category: string;
  subcategory: string;
  brand: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
  isFeatured?: boolean;
  sort: "relevance" | "price_asc" | "price_desc" | "newest" | "rating" | "popular";
  page: number;
  limit: number;
}

const ALLOWED_SORT_OPTIONS: Array<ValidatedProductQuery["sort"]> = [
  "relevance",
  "price_asc",
  "price_desc",
  "newest",
  "rating",
  "popular",
];

const SORT_ALIAS_MAP: Record<string, ValidatedProductQuery["sort"]> = {
  "price-low": "price_asc",
  "price_low": "price_asc",
  "price-high": "price_desc",
  "price_high": "price_desc",
  "new": "newest",
  "bestsellers": "popular",
  "bestseller": "popular",
};

export function validateProductQuery(rawQuery: Record<string, any> = {}): ValidatedProductQuery {
  const qRaw = rawQuery.q !== undefined ? rawQuery.q : rawQuery.search;
  const q = typeof qRaw === "string" ? qRaw.trim() : "";

  const category = typeof rawQuery.category === "string" ? rawQuery.category.trim() : "";
  const subcategory = typeof rawQuery.subcategory === "string" ? rawQuery.subcategory.trim() : "";
  const brand = typeof rawQuery.brand === "string" ? rawQuery.brand.trim() : "";

  let page = parseInt(rawQuery.page, 10);
  if (isNaN(page) || page < 1) page = 1;

  let limit = parseInt(rawQuery.limit, 10);
  if (isNaN(limit) || limit < 1) limit = 20;
  else if (limit > 100) limit = 100;

  let minPrice: number | undefined;
  if (rawQuery.minPrice !== undefined && rawQuery.minPrice !== "") {
    const parsedMin = Number(rawQuery.minPrice);
    if (!isNaN(parsedMin) && parsedMin >= 0) minPrice = parsedMin;
  }

  let maxPrice: number | undefined;
  if (rawQuery.maxPrice !== undefined && rawQuery.maxPrice !== "") {
    const parsedMax = Number(rawQuery.maxPrice);
    if (!isNaN(parsedMax) && parsedMax >= 0) maxPrice = parsedMax;
  }

  if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
    const temp = minPrice;
    minPrice = maxPrice;
    maxPrice = temp;
  }

  let minRating: number | undefined;
  if (rawQuery.minRating !== undefined && rawQuery.minRating !== "") {
    const parsedRating = Number(rawQuery.minRating);
    if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
      minRating = parsedRating;
    }
  }

  const inStock = rawQuery.inStock === "true" || rawQuery.inStock === true;
  const isFeatured = rawQuery.isFeatured === "true" || rawQuery.isFeatured === true ? true : undefined;

  let sortInput = typeof rawQuery.sort === "string" ? rawQuery.sort.trim().toLowerCase() : "";
  if (SORT_ALIAS_MAP[sortInput]) {
    sortInput = SORT_ALIAS_MAP[sortInput];
  }

  let sort: ValidatedProductQuery["sort"] = ALLOWED_SORT_OPTIONS.includes(sortInput as any)
    ? (sortInput as ValidatedProductQuery["sort"])
    : (q ? "relevance" : "newest");

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
