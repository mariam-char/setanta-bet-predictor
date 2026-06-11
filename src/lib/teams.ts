import type { GroupId, Team } from "@/types";

/**
 * Official 2026 FIFA World Cup group draw (December 5, 2025).
 * `seed` approximates the FIFA ranking at the time of the draw and powers
 * the confidence score — it has no effect on bracket logic.
 */
export const TEAMS: Team[] = [
  // Group A
  { id: "MEX", name: "Mexico", shortName: "MEX", flag: "🇲🇽", group: "A", seed: 15 },
  { id: "RSA", name: "South Africa", shortName: "RSA", flag: "🇿🇦", group: "A", seed: 61 },
  { id: "KOR", name: "South Korea", shortName: "KOR", flag: "🇰🇷", group: "A", seed: 22 },
  { id: "CZE", name: "Czech Republic", shortName: "CZE", flag: "🇨🇿", group: "A", seed: 44 },
  // Group B
  { id: "CAN", name: "Canada", shortName: "CAN", flag: "🇨🇦", group: "B", seed: 27 },
  { id: "BIH", name: "Bosnia and Herzegovina", shortName: "BIH", flag: "🇧🇦", group: "B", seed: 70 },
  { id: "QAT", name: "Qatar", shortName: "QAT", flag: "🇶🇦", group: "B", seed: 51 },
  { id: "SUI", name: "Switzerland", shortName: "SUI", flag: "🇨🇭", group: "B", seed: 17 },
  // Group C
  { id: "BRA", name: "Brazil", shortName: "BRA", flag: "🇧🇷", group: "C", seed: 5 },
  { id: "MAR", name: "Morocco", shortName: "MAR", flag: "🇲🇦", group: "C", seed: 11 },
  { id: "HAI", name: "Haiti", shortName: "HAI", flag: "🇭🇹", group: "C", seed: 84 },
  { id: "SCO", name: "Scotland", shortName: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", seed: 36 },
  // Group D
  { id: "USA", name: "United States", shortName: "USA", flag: "🇺🇸", group: "D", seed: 14 },
  { id: "PAR", name: "Paraguay", shortName: "PAR", flag: "🇵🇾", group: "D", seed: 39 },
  { id: "AUS", name: "Australia", shortName: "AUS", flag: "🇦🇺", group: "D", seed: 26 },
  { id: "TUR", name: "Turkey", shortName: "TUR", flag: "🇹🇷", group: "D", seed: 25 },
  // Group E
  { id: "GER", name: "Germany", shortName: "GER", flag: "🇩🇪", group: "E", seed: 9 },
  { id: "CUW", name: "Curaçao", shortName: "CUW", flag: "🇨🇼", group: "E", seed: 82 },
  { id: "CIV", name: "Ivory Coast", shortName: "CIV", flag: "🇨🇮", group: "E", seed: 42 },
  { id: "ECU", name: "Ecuador", shortName: "ECU", flag: "🇪🇨", group: "E", seed: 23 },
  // Group F
  { id: "NED", name: "Netherlands", shortName: "NED", flag: "🇳🇱", group: "F", seed: 7 },
  { id: "JPN", name: "Japan", shortName: "JPN", flag: "🇯🇵", group: "F", seed: 19 },
  { id: "SWE", name: "Sweden", shortName: "SWE", flag: "🇸🇪", group: "F", seed: 40 },
  { id: "TUN", name: "Tunisia", shortName: "TUN", flag: "🇹🇳", group: "F", seed: 43 },
  // Group G
  { id: "BEL", name: "Belgium", shortName: "BEL", flag: "🇧🇪", group: "G", seed: 8 },
  { id: "EGY", name: "Egypt", shortName: "EGY", flag: "🇪🇬", group: "G", seed: 34 },
  { id: "IRN", name: "Iran", shortName: "IRN", flag: "🇮🇷", group: "G", seed: 21 },
  { id: "NZL", name: "New Zealand", shortName: "NZL", flag: "🇳🇿", group: "G", seed: 86 },
  // Group H
  { id: "ESP", name: "Spain", shortName: "ESP", flag: "🇪🇸", group: "H", seed: 1 },
  { id: "CPV", name: "Cape Verde", shortName: "CPV", flag: "🇨🇻", group: "H", seed: 68 },
  { id: "KSA", name: "Saudi Arabia", shortName: "KSA", flag: "🇸🇦", group: "H", seed: 60 },
  { id: "URU", name: "Uruguay", shortName: "URU", flag: "🇺🇾", group: "H", seed: 16 },
  // Group I
  { id: "FRA", name: "France", shortName: "FRA", flag: "🇫🇷", group: "I", seed: 3 },
  { id: "SEN", name: "Senegal", shortName: "SEN", flag: "🇸🇳", group: "I", seed: 18 },
  { id: "IRQ", name: "Iraq", shortName: "IRQ", flag: "🇮🇶", group: "I", seed: 58 },
  { id: "NOR", name: "Norway", shortName: "NOR", flag: "🇳🇴", group: "I", seed: 29 },
  // Group J
  { id: "ARG", name: "Argentina", shortName: "ARG", flag: "🇦🇷", group: "J", seed: 2 },
  { id: "ALG", name: "Algeria", shortName: "ALG", flag: "🇩🇿", group: "J", seed: 35 },
  { id: "AUT", name: "Austria", shortName: "AUT", flag: "🇦🇹", group: "J", seed: 24 },
  { id: "JOR", name: "Jordan", shortName: "JOR", flag: "🇯🇴", group: "J", seed: 66 },
  // Group K
  { id: "POR", name: "Portugal", shortName: "POR", flag: "🇵🇹", group: "K", seed: 6 },
  { id: "COD", name: "DR Congo", shortName: "COD", flag: "🇨🇩", group: "K", seed: 56 },
  { id: "UZB", name: "Uzbekistan", shortName: "UZB", flag: "🇺🇿", group: "K", seed: 50 },
  { id: "COL", name: "Colombia", shortName: "COL", flag: "🇨🇴", group: "K", seed: 13 },
  // Group L
  { id: "ENG", name: "England", shortName: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", seed: 4 },
  { id: "CRO", name: "Croatia", shortName: "CRO", flag: "🇭🇷", group: "L", seed: 10 },
  { id: "GHA", name: "Ghana", shortName: "GHA", flag: "🇬🇭", group: "L", seed: 72 },
  { id: "PAN", name: "Panama", shortName: "PAN", flag: "🇵🇦", group: "L", seed: 30 },
];

export const GROUP_IDS: GroupId[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t])
);

export function teamsInGroup(group: GroupId): Team[] {
  return TEAMS.filter((t) => t.group === group);
}
