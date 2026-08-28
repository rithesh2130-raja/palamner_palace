import { apiClient } from "./api/apiClient";

export async function getWishlist() {
  const response: any = await apiClient.get("/wishlist");
  return response;
}

export async function addToWishlist(productId: string) {
  const response: any = await apiClient.post(`/wishlist/${productId}`);
  return response;
}

export async function removeFromWishlist(productId: string) {
  const response: any = await apiClient.delete(`/wishlist/${productId}`);
  return response;
}

export const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
