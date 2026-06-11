/**
 * Push the Prisma schema to Aurora using IAM auth (Vercel OIDC).
 * Usage: node scripts/db-push.mjs
 * Requires: `vercel env pull .env.local` first (fresh VERCEL_OIDC_TOKEN).
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { Signer } from "@aws-sdk/rds-signer";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

// Load .env.local + .env (local overrides base)
for (const file of [".env", ".env.local"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_0-9]+)="?([^"]*)"?\s*$/);
      if (m && !line.trim().startsWith("#")) process.env[m[1]] = m[2];
    }
  } catch { /* file may not exist */ }
}

const { PGHOST, PGUSER, PGDATABASE, PGPORT = "5432", AWS_REGION, AWS_ROLE_ARN } = process.env;
if (!PGHOST || !AWS_ROLE_ARN) {
  console.warn("PGHOST / AWS_ROLE_ARN not set — skipping db push (nothing to do).");
  process.exit(0);
}

const signer = new Signer({
  hostname: PGHOST,
  port: Number(PGPORT),
  username: PGUSER,
  region: AWS_REGION,
  credentials: awsCredentialsProvider({
    roleArn: AWS_ROLE_ARN,
    clientConfig: { region: AWS_REGION },
  }),
});

const token = await signer.getAuthToken();
const url = `postgresql://${encodeURIComponent(PGUSER)}:${encodeURIComponent(token)}@${PGHOST}:${PGPORT}/${PGDATABASE || "postgres"}?sslmode=require`;

console.log(`Pushing schema to ${PGHOST} as ${PGUSER} (IAM auth)…`);
const res = spawnSync("npx", ["prisma", "db", "push"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: url },
});
process.exit(res.status ?? 1);
