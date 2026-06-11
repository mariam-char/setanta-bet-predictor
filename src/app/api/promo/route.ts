import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TEAMS_BY_ID } from "@/lib/teams";

const PROMO_CODE = "WC26_FINALIST_50SPINS";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

const bodySchema = z.object({
  finalistTeamIds: z.array(z.string().min(2).max(4)).length(2),
  contact: z.string().trim().min(5).max(254),
});

function classifyContact(raw: string): "EMAIL" | "PHONE" | null {
  const value = raw.trim();
  if (EMAIL_RE.test(value)) return "EMAIL";
  if (PHONE_RE.test(value) && value.replace(/\D/g, "").length >= 7) return "PHONE";
  return null;
}

/** Normalize so "+995 555 12 34 56" and "+995555123456" count as one entry. */
function normalizeContact(value: string, type: "EMAIL" | "PHONE"): string {
  return type === "EMAIL"
    ? value.trim().toLowerCase()
    : value.replace(/[^\d+]/g, "");
}

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { finalistTeamIds, contact } = parsed.data;
  const [finalist1, finalist2] = finalistTeamIds;

  if (!TEAMS_BY_ID[finalist1] || !TEAMS_BY_ID[finalist2]) {
    return NextResponse.json({ error: "Unknown team" }, { status: 422 });
  }
  if (finalist1 === finalist2) {
    return NextResponse.json({ error: "Finalists must be two different teams" }, { status: 422 });
  }

  const contactType = classifyContact(contact);
  if (!contactType) {
    return NextResponse.json(
      { error: "Enter a valid email address or phone number" },
      { status: 422 }
    );
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  try {
    const entry = await prisma.promoEntry.create({
      data: {
        promoCode: PROMO_CODE,
        contact: normalizeContact(contact, contactType),
        contactType,
        finalist1TeamId: finalist1,
        finalist2TeamId: finalist2,
        submittedAt: new Date(),
        userId,
      },
    });
    return NextResponse.json({ entry: { id: entry.id } }, { status: 201 });
  } catch (e: unknown) {
    // Prisma P2002 = unique constraint (already entered with this contact)
    if (
      typeof e === "object" &&
      e !== null &&
      (e as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This email or phone number has already entered the promotion" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
