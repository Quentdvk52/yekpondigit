import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Application
  NEXT_PUBLIC_APP_NAME: z.string().default("YEKPON DIGIT"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_DEMO_BASE_URL: z.string().url().default("http://localhost:3001"),

  // Base de données PostgreSQL
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEON_API_KEY: z.string().optional(),

  // Stockage S3
  AWS_ENDPOINT_URL_S3: z.string().url().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default("us-east-2"),
  S3_BUCKET_PRIVATE: z.string().default("product-files"),
  S3_BUCKET_PUBLIC: z.string().default("public-assets"),

  // Authentification & Sécurité
  AUTH_SECRET: z.string().min(16).default("dev-secret-auth-key-min-16-chars"),
  ADMIN_2FA_ISSUER: z.string().default("YEKPON DIGIT"),
  LICENSE_SIGNING_SECRET: z.string().min(16).default("dev-license-signing-secret-key-32ch"),
  DOWNLOAD_TOKEN_SECRET: z.string().min(16).default("dev-download-token-secret-key-32ch"),
  DEMO_CREDENTIALS_KEY: z.string().default("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
  CRON_SECRET: z.string().default("dev-cron-secret"),

  // Rate limit
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Emails
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("YEKPON DIGIT <contact@yekpondigit.com>"),

  // Providers
  PAYMENT_PROVIDERS_ENABLED: z.string().default("sandbox"),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables configuration:");
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
  }
  // En mode test / dev, assigner un fallback avec defaults
  parsedEnv = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/yekpon_digit",
    ...process.env,
  });
}

export const env = parsedEnv;
