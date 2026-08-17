import { env } from "../config/env.js";

export function printStartupBanner(): void {
  const line = "─".repeat(55);
  console.log(`\n${line}`);
  console.log(`  ShopSphere API`);
  console.log(`  Environment: ${env.NODE_ENV}`);
  console.log(`  Port:        ${env.PORT}`);
  console.log(`  Database:    Connected`);
  console.log(`  API Base:    http://localhost:${env.PORT}/api/v1`);
  console.log(`  Health:      http://localhost:${env.PORT}/api/v1/health`);
  console.log(`${line}\n`);
}
