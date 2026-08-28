import { apiClient } from "./api/apiClient";

export async function getCart() {
  const response: any = await apiClient.get("/cart");
  return response;
}

export async function addToCart(productId: string, quantity = 1) {
  const response: any = await apiClient.post("/cart/items", {
    productId,
    quantity,
  });
  return response;
}

export async function updateCartItem(productId: string, quantity: number) {
  const response: any = await apiClient.patch(`/cart/items/${productId}`, {
    quantity,
  });
  return response;
}

export async function removeCartItem(productId: string) {
  const response: any = await apiClient.delete(`/cart/items/${productId}`);
  return response;
}

export async function clearCart() {
  const response: any = await apiClient.delete("/cart");
  return response;
}

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

export default cartService;
