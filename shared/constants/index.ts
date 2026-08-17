export const APP_NAME = "ShopSphere";
export const API_VERSION = "v1";
export const DEFAULT_PORT = 5000;
export const DEFAULT_CLIENT_URL = "http://localhost:5173";

export const USER_ROLES = {
  CUSTOMER: "Customer",
  CREATOR: "Creator",
  SELLER: "Seller",
  ADMIN: "Admin",
  SUPER_ADMIN: "SuperAdmin",
} as const;

export const REEL_LIMITS = {
  MAX_DURATION_SECONDS: 60,
  MAX_ASPECT_RATIO: "9:16",
};
