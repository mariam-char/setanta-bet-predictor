import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * One-time schema setup, run from inside Vercel's runtime where the Aurora
 * network path exists (build containers can't reach the DB).
 *
 * Usage: GET /api/admin/setup-db?secret=<NEXTAUTH_SECRET>
 * Idempotent — every statement is IF NOT EXISTS.
 */
const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "handle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_handle_key" ON "User"("handle")`,

  `CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`,

  `CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`,

  `CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")`,

  `CREATE TABLE IF NOT EXISTS "Prediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupRankings" JSONB NOT NULL,
    "qualifiedThirdGroups" JSONB NOT NULL,
    "matchWinners" JSONB NOT NULL,
    "championTeamId" TEXT,
    "confidence" INTEGER,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreBreakdown" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Prediction_userId_key" ON "Prediction"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Prediction_score_idx" ON "Prediction"("score")`,
  `CREATE INDEX IF NOT EXISTS "Prediction_championTeamId_idx" ON "Prediction"("championTeamId")`,

  `CREATE TABLE IF NOT EXISTS "MatchResult" (
    "matchNumber" INTEGER NOT NULL,
    "homeTeamId" TEXT,
    "awayTeamId" TEXT,
    "winnerTeamId" TEXT,
    "stage" TEXT NOT NULL,
    "decidedAt" TIMESTAMP(3),
    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("matchNumber")
  )`,

  `CREATE TABLE IF NOT EXISTS "PromoEntry" (
    "id" TEXT NOT NULL,
    "promoCode" TEXT NOT NULL DEFAULT 'WC26_FINALIST_50COINS',
    "contact" TEXT NOT NULL,
    "contactType" TEXT NOT NULL,
    "finalist1TeamId" TEXT NOT NULL,
    "finalist2TeamId" TEXT NOT NULL,
    "userId" TEXT,
    "isWinner" BOOLEAN,
    "settledAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PromoEntry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PromoEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PromoEntry_promoCode_contact_key" ON "PromoEntry"("promoCode", "contact")`,
  `CREATE INDEX IF NOT EXISTS "PromoEntry_finalist1TeamId_idx" ON "PromoEntry"("finalist1TeamId")`,
  `CREATE INDEX IF NOT EXISTS "PromoEntry_finalist2TeamId_idx" ON "PromoEntry"("finalist2TeamId")`,

  `CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "AnalyticsEvent_name_createdAt_idx" ON "AnalyticsEvent"("name", "createdAt")`,
];

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { statement: string; ok: boolean; error?: string }[] = [];
  for (const sql of DDL) {
    const label = sql.slice(0, 60).replace(/\s+/g, " ");
    try {
      await prisma.$executeRawUnsafe(sql);
      results.push({ statement: label, ok: true });
    } catch (e) {
      results.push({
        statement: label,
        ok: false,
        error: e instanceof Error ? e.message.slice(0, 200) : String(e),
      });
    }
  }

  const failed = results.filter((r) => !r.ok).length;
  return NextResponse.json(
    { done: failed === 0, failed, results },
    { status: failed === 0 ? 200 : 500 }
  );
}
