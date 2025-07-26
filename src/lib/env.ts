import { z } from "zod";

/**
 * Environment Variable Schema
 * Validates all environment variables used in the application
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001/api"),
  
  // API Configuration (Server-side only)
  API_SECRET_KEY: z.string().min(1).optional(),
  
  // Database Configuration (Server-side only)
  DATABASE_URL: z.string().url().optional(),
  DATABASE_POOL_MAX: z.coerce.number().min(1).max(100).default(10),
  
  // Authentication (Server-side only)
  AUTH_SECRET: z.string().min(32).optional(), // Auth.js v5 uses AUTH_SECRET
  NEXTAUTH_URL: z.string().url().optional(), // Still used for Auth.js configuration
  
  // OAuth Providers (Server-side only)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Third-party Services
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_DEBUG: z.coerce.boolean().default(false),
  
  // Vercel Environment Variables (Auto-populated)
  VERCEL: z.coerce.boolean().optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  
  // Azure Environment Variables (Future migration)
  AZURE_CLIENT_ID: z.string().optional(),
  AZURE_CLIENT_SECRET: z.string().optional(),
  AZURE_TENANT_ID: z.string().optional(),
  
  // Performance
  NEXT_PUBLIC_CDN_URL: z.string().url().optional(),
  
  // OpenTelemetry / Dash0 Configuration (Server-side only)
  DASH0_AUTH_TOKEN: z.string().min(1).optional(),
  DASH0_DATASET: z.string().min(1).default("dev"),
  DASH0_TRACE_ENDPOINT: z.string().url().default("https://api.dash0.com/v1/traces"),
  DASH0_METRICS_ENDPOINT: z.string().url().default("https://api.dash0.com/v1/metrics"),
  DASH0_LOGS_ENDPOINT: z.string().url().default("https://api.dash0.com/v1/logs"),
});

/**
 * Client-side Environment Variables Schema
 * Only includes NEXT_PUBLIC_ variables that are safe for client-side use
 */
const clientEnvSchema = envSchema.pick({
  NODE_ENV: true,
  NEXT_PUBLIC_APP_URL: true,
  NEXT_PUBLIC_API_URL: true,
  NEXT_PUBLIC_ANALYTICS_ID: true,
  NEXT_PUBLIC_ENABLE_ANALYTICS: true,
  NEXT_PUBLIC_ENABLE_DEBUG: true,
  NEXT_PUBLIC_CDN_URL: true,
});

/**
 * Server-side Environment Variables Schema
 * Includes all environment variables (server-side only)
 */
const serverEnvSchema = envSchema;

/**
 * Parse and validate environment variables
 */
function parseEnv() {
  // Check if we're on the client or server side
  const isServer = typeof window === "undefined";
  
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    ...(isServer && {
      API_SECRET_KEY: process.env.API_SECRET_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX,
      AUTH_SECRET: process.env.AUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      SENTRY_DSN: process.env.SENTRY_DSN,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
      AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
      AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
      AUTH_SECRET: process.env.AUTH_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      DASH0_AUTH_TOKEN: process.env.DASH0_AUTH_TOKEN,
      DASH0_DATASET: process.env.DASH0_DATASET,
      DASH0_TRACE_ENDPOINT: process.env.DASH0_TRACE_ENDPOINT,
      DASH0_METRICS_ENDPOINT: process.env.DASH0_METRICS_ENDPOINT,
      DASH0_LOGS_ENDPOINT: process.env.DASH0_LOGS_ENDPOINT,
    }),
  };

  // Use appropriate schema based on environment
  const schema = isServer ? serverEnvSchema : clientEnvSchema;
  
  const parsed = schema.safeParse(env);
  
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  
  return parsed.data;
}

/**
 * Validated environment variables
 * This will throw an error if any required environment variables are missing or invalid
 */
export const env = parseEnv();

/**
 * Type definitions for environment variables
 */
export type Env = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Helper functions for environment detection
 */
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

/**
 * Helper functions for deployment environment detection
 */
export const isVercel = env.VERCEL === true;
export const isVercelPreview = env.VERCEL_ENV === "preview";
export const isVercelProduction = env.VERCEL_ENV === "production";

/**
 * Get the current deployment environment
 */
export const getDeploymentEnvironment = (): "local" | "development" | "staging" | "production" => {
  if (!isVercel) return "local";
  
  switch (env.VERCEL_ENV) {
    case "development":
      return "development";
    case "preview":
      return "staging"; // Preview deployments can be considered staging
    case "production":
      return "production";
    default:
      return "local";
  }
};

/**
 * Get the current app URL based on environment
 */
export const getAppUrl = (): string => {
  // In Vercel, use VERCEL_URL for preview deployments
  if (isVercel && env.VERCEL_URL && env.VERCEL_ENV === "preview") {
    return `https://${env.VERCEL_URL}`;
  }
  
  return env.NEXT_PUBLIC_APP_URL;
};

/**
 * Feature flags helper
 */
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  debug: env.NEXT_PUBLIC_ENABLE_DEBUG,
} as const;

/**
 * OpenTelemetry / Dash0 configuration helper
 * Only available server-side
 */
export const getDash0Config = () => {
  if (typeof window !== "undefined") {
    throw new Error("Dash0 configuration is only available server-side");
  }
  
  return {
    authToken: env.DASH0_AUTH_TOKEN,
    dataset: env.DASH0_DATASET,
    endpoints: {
      traces: env.DASH0_TRACE_ENDPOINT,
      metrics: env.DASH0_METRICS_ENDPOINT,
      logs: env.DASH0_LOGS_ENDPOINT,
    },
    isConfigured: !!env.DASH0_AUTH_TOKEN,
  };
};