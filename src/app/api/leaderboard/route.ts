import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Public leaderboard. Scores are recomputed by a results worker whenever
 * a MatchResult lands (see docs/03-api-spec.md for the scoring rubric).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
  const cursor = searchParams.get("cursor") ?? undefined;

  const entries = await prisma.prediction.findMany({
    where: { isComplete: true },
    orderBy: [{ score: "desc" }, { submittedAt: "asc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      score: true,
      championTeamId: true,
      confidence: true,
      user: { select: { handle: true, image: true } },
    },
  });

  const nextCursor = entries.length > limit ? entries.pop()!.id : null;
  return NextResponse.json({ entries, nextCursor });
}
