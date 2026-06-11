export type GroupId =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export type TeamId = string; // ISO-ish slug, e.g. "BRA"

export interface Team {
  id: TeamId;
  name: string;
  shortName: string; // 3-letter code shown on match cards
  flag: string; // emoji flag
  group: GroupId;
  /** Seeding rank used for the confidence score (approx. FIFA ranking at draw). */
  seed: number;
}

export type Round = "R32" | "R16" | "QF" | "SF" | "TPP" | "F";

/** A slot is either resolved from group standings or from a previous match. */
export type SlotRef =
  | { kind: "groupWinner"; group: GroupId }
  | { kind: "groupRunnerUp"; group: GroupId }
  | { kind: "thirdPlace"; allowedGroups: GroupId[] }
  | { kind: "matchWinner"; match: MatchId }
  | { kind: "matchLoser"; match: MatchId };

export type MatchId = number; // official FIFA numbering 73–104

export interface MatchDef {
  id: MatchId;
  round: Round;
  home: SlotRef;
  away: SlotRef;
}

/** Resolved match for rendering: slots turned into teams where possible. */
export interface ResolvedMatch {
  def: MatchDef;
  home: Team | null;
  away: Team | null;
  homeLabel: string; // e.g. "Winner Group C" when unresolved
  awayLabel: string;
  winner: TeamId | null;
}

export interface PredictionState {
  /** Ordered 1st→4th per group. */
  groupRankings: Partial<Record<GroupId, TeamId[]>>;
  /** The 8 groups whose third-placed team the user advances. */
  qualifiedThirdGroups: GroupId[];
  /** Winner picks keyed by official match number. */
  matchWinners: Partial<Record<MatchId, TeamId>>;
  /** Unlocked achievement ids. */
  achievements: string[];
  updatedAt: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ConfidenceBreakdown {
  /** 0–100. High = chalk (favorites), low = chaos (upsets). */
  score: number;
  totalPicks: number;
  favoritesPicked: number;
  upsetsPicked: number;
  label: string; // "Chalk Master", "Calculated Risk", "Agent of Chaos"…
}
