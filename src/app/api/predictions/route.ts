import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { allocateThirds, resolveBracket } from "@/lib/bracket";
import { confidenceScore } from "@/lib/confidence";
import type { GroupId, PredictionState } from "@/types";
import { GROUP_IDS, TEAMS_BY_ID } from "@/lib/teams";

const groupId = z.enum(["A","B","C","D","E","F","G","H","I","J","K","L"]);

const bodySchema = z.object({
  groupRankings: z.record(groupId, z.array(z.string()).length(4)),
  qualifiedThirdGroups: z.array(groupId).max(8),
  matchWinners: z.record(z.string(), z.string()),
});

/** Server-side validation mirrors client rules — never trust the wire. */
function validate(body: z.infer<typeof bodySchema>): string | null {
  for (const [g, ranking] of Object.entries(body.groupRankings)) {
    if (!ranking) continue;
    for (const teamId of ranking) {
      const team = TEAMS_BY_ID[teamId];
      if (!team || team.group !== g) return `Team ${teamId} is not in group ${g}`;
    }
    if (new Set(ranking).size !== 4) return `Duplicate team in group ${g}`;
  }
  if (
    body.qualifiedThirdGroups.length === 8 &&
    !allocateThirds(body.qualifiedThirdGroups as GroupId[])
  ) {
    return "Third-place combination is not allocatable";
  }
  return null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prediction = await prisma.prediction.findUnique({ where: { userId } });
  return NextResponse.json({ prediction });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  // Anonymous users keep local persistence only — return 204 so the
  // client autosave loop stays silent.
  if (!userId) return new NextResponse(null, { status: 204 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const err = validate(parsed.data);
  if (err) return NextResponse.json({ error: err }, { status: 422 });

  const state: PredictionState = {
    groupRankings: parsed.data.groupRankings,
    qualifiedThirdGroups: parsed.data.qualifiedThirdGroups as GroupId[],
    matchWinners: Object.fromEntries(
      Object.entries(parsed.data.matchWinners).map(([k, v]) => [Number(k), v])
    ),
    achievements: [],
    updatedAt: null,
  };

  const resolved = resolveBracket(state);
  const champion = resolved.get(104)?.winner ?? null;
  const groupsDone =
    GROUP_IDS.every((g) => state.groupRankings[g]?.length === 4);
  let picksDone = 0;
  for (const m of resolved.values()) if (m.winner) picksDone++;
  const isComplete = groupsDone && picksDone === 32;
  const confidence = confidenceScore(state).score;

  const prediction = await prisma.prediction.upsert({
    where: { userId },
    create: {
      userId,
      groupRankings: parsed.data.groupRankings,
      qualifiedThirdGroups: parsed.data.qualifiedThirdGroups,
      matchWinners: parsed.data.matchWinners,
      championTeamId: champion,
      confidence,
      isComplete,
      submittedAt: isComplete ? new Date() : null,
    },
    update: {
      groupRankings: parsed.data.groupRankings,
      qualifiedThirdGroups: parsed.data.qualifiedThirdGroups,
      matchWinners: parsed.data.matchWinners,
      championTeamId: champion,
      confidence,
      isComplete,
      submittedAt: isComplete ? new Date() : null,
    },
  });

  return NextResponse.json({ prediction });
}
