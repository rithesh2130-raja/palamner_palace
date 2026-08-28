import { Router } from "express";
import { getHealthStatus } from "../controllers/healthController.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";

const apiRouter = Router();

// Health Check Route
apiRouter.get("/health", getHealthStatus);

apiRouter.use("/products", productRoutes);
apiRouter.use("/cart", cartRoutes);
apiRouter.use("/wishlist", wishlistRoutes);

export default apiRouter;
