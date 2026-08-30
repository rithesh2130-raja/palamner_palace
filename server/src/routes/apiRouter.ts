import { Router } from "express";
import { getHealthStatus } from "../controllers/healthController.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
// @ts-ignore
import authRoutes from "./authRoutes.js";
// @ts-ignore
import userRoutes from "./userRoutes.js";
// @ts-ignore
import addressRoutes from "./addressRoutes.js";

const apiRouter = Router();

// Health Check Route
apiRouter.get("/health", getHealthStatus);

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/addresses", addressRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/cart", cartRoutes);
apiRouter.use("/wishlist", wishlistRoutes);

export default apiRouter;
