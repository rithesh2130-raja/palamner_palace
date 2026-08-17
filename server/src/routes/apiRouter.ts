import { Router } from "express";
import { getHealthStatus } from "../controllers/healthController.js";

const apiRouter = Router();

// Health Check Route
apiRouter.get("/health", getHealthStatus);

// Future API Domain Routes (Placeholders for Day 2+)
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/users', userRouter);
// apiRouter.use('/products', productRouter);
// apiRouter.use('/reels', reelRouter);
// apiRouter.use('/orders', orderRouter);
// apiRouter.use('/creators', creatorRouter);
// apiRouter.use('/admin', adminRouter);

export default apiRouter;
