import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const eventSchema = z.object({
  name: z.enum([
    "welcome_cta_clicked",
    "group_completed",
    "all_groups_completed",
    "thirds_completed",
    "bracket_generated",
    "round_completed",
    "champion_revealed",
    "share_clicked",
    "prediction_reset",
  ]),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const parsed = eventSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  await prisma.analyticsEvent.create({
    data: {
      userId,
      name: parsed.data.name,
      payload: parsed.data.payload as object | undefined,
    },
  });

  return new NextResponse(null, { status: 204 });
}
