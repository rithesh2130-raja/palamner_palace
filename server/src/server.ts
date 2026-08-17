import { createApp } from "./app.js";
import { env, validateEnv } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { printStartupBanner } from "./utils/logger.js";
import http from "http";

async function bootstrap(): Promise<void> {
  // Validate environment variables
  validateEnv();

  // Connect to MongoDB
  await connectDatabase();

  // Create Express App & Server
  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    printStartupBanner();
  });

  // Graceful Shutdown Handlers (Section 43)
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("[Server] HTTP Server closed.");
      await disconnectDatabase();
      console.log("[Server] Graceful shutdown complete. Exiting.");
      process.exit(0);
    });

    // Force shutdown after 10s if hanging
    setTimeout(() => {
      console.error("[Server] Forced shutdown due to timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to bootstrap ShopSphere server:", err);
  process.exit(1);
});
