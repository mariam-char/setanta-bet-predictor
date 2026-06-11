import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { Signer } from "@aws-sdk/rds-signer";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";
import { attachDatabasePool } from "@vercel/functions";

/**
 * Database client.
 *
 * Production (Vercel + AWS Aurora Postgres): connects with short-lived IAM
 * auth tokens minted via Vercel's OIDC federation — no static DB password.
 * Each new pool connection calls the Signer for a fresh token (tokens live
 * ~15 min, but existing connections stay valid after expiry).
 *
 * Local dev: falls back to a classic DATABASE_URL connection string when
 * AWS_ROLE_ARN is not set.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function buildAuroraClient(): PrismaClient {
  const signer = new Signer({
    hostname: process.env.PGHOST!,
    port: Number(process.env.PGPORT ?? 5432),
    username: process.env.PGUSER!,
    region: process.env.AWS_REGION!,
    credentials: awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN!,
      clientConfig: { region: process.env.AWS_REGION! },
    }),
  });

  const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE || "postgres",
    password: () => signer.getAuthToken(),
    port: Number(process.env.PGPORT ?? 5432),
    ssl: { rejectUnauthorized: false },
    max: 5, // serverless: keep per-instance pools small
  });

  // Let Vercel drain the pool cleanly when the function instance suspends.
  attachDatabasePool(pool);

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function buildClient(): PrismaClient {
  // Aurora + IAM auth when the Vercel↔AWS OIDC role is configured.
  if (process.env.AWS_ROLE_ARN && process.env.PGHOST) return buildAuroraClient();
  // Otherwise: plain connection string (local dev, docker, CI).
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? buildClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
