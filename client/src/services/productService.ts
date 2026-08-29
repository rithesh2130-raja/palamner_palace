import { apiClient } from './api/apiClient';
import { Product, ProductFilters, ProductsResponse, SingleProductResponse, SearchSuggestionsResponse } from '../types/product';

export async function getProducts(params: ProductFilters = {}): Promise<ProductsResponse> {
  const queryParams: Record<string, string | number | boolean | undefined> = { ...params };
  const response = await apiClient.get<ProductsResponse>('/products', { params: queryParams });
  return response;
}

export async function getProduct(id: string): Promise<SingleProductResponse> {
  const response = await apiClient.get<SingleProductResponse>(`/products/${id}`);
  return response;
}

export async function getProductBySlug(slug: string): Promise<SingleProductResponse> {
  const response = await apiClient.get<SingleProductResponse>(`/products/slug/${slug}`);
  return response;
}

export async function getFeaturedProducts(): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>('/products/featured');
  return response;
}

export async function getProductsByCategory(category: string): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>(`/products/category/${category}`);
  return response;
}

export async function createProduct(productData: Partial<Product>): Promise<SingleProductResponse> {
  const response = await apiClient.post<SingleProductResponse>('/products', productData);
  return response;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<SingleProductResponse> {
  const response = await apiClient.patch<SingleProductResponse>(`/products/${id}`, productData);
  return response;
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
  const response = await apiClient.delete<{ success: boolean; message?: string }>(`/products/${id}`);
  return response;
}

export async function getSearchSuggestions(q: string): Promise<SearchSuggestionsResponse> {
  const response = await apiClient.get<SearchSuggestionsResponse>('/products/suggestions', {
    params: { q },
  });
  return response;
}

export const productService = {
  getProducts,
  getProduct,
  getProductBySlug,
  getFeaturedProducts,
  getProductsByCategory,
  getSearchSuggestions,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
