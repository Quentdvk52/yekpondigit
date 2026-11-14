import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/server/db";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const dbStatus = await checkDatabaseConnection();

  const isHealthy = dbStatus.ok;
  const statusCode = isHealthy ? 200 : 503;

  const response = {
    status: isHealthy ? "healthy" : "degraded",
    appName: env.NEXT_PUBLIC_APP_NAME,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - start,
    checks: {
      database: {
        status: dbStatus.ok ? "connected" : "disconnected",
        latencyMs: dbStatus.latencyMs,
        ...(dbStatus.error ? { error: dbStatus.error } : {}),
      },
      storage: {
        status: env.AWS_ENDPOINT_URL_S3 ? "configured" : "mocked",
        region: env.AWS_REGION,
      },
      environment: {
        mode: env.NODE_ENV,
        paymentsEnabled: env.PAYMENT_PROVIDERS_ENABLED.split(","),
      },
    },
  };

  return NextResponse.json(response, { status: statusCode });
}
