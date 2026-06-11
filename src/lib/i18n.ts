"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Round, Team } from "@/types";

export type Lang = "en" | "ka";

/* ── Language store (persisted) ───────────────────────────────────── */

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguage = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
    }),
    { name: "wc26-lang" }
  )
);

/* ── UI strings ───────────────────────────────────────────────────── */

const en = {
  // Welcome
  "hero.kicker": "Canada · Mexico · United States — Summer 2026",
  "hero.title1": "Call every match.",
  "hero.title2": "Crown your champion.",
  "hero.sub":
    "48 teams. 12 groups. 104 matches. Predict the entire World Cup — from the opening whistle in Mexico City to the final at MetLife Stadium — and stay in the game all tournament long.",
  "hero.cta": "Create your prediction →",
  "hero.meta": "Takes about 5 minutes · Auto-saves as you go · Edit anytime",
  "how.aria": "How it works",
  "step1.title": "Rank the groups",
  "step1.copy": "Drag every team into place, 1st to 4th, across all 12 groups.",
  "step2.title": "Pick the knockouts",
  "step2.copy": "Your standings build the official Round of 32. Tap winners to the final.",
  "step3.title": "Share your call",
  "step3.copy": "Reveal your champion, grab your bragging card, climb the leaderboard.",

  // Groups page
  "groups.title": "Group stage",
  "groups.sub":
    "Set your final standings for every group. The top two go through — third place might sneak in as one of the eight best wildcards.",
  "groups.pagesAria": "Group pages",
  "groups.ranked": "{done}/12 groups ranked",
  "nav.back": "← Back",
  "nav.next": "Next →",
  "nav.review": "Review →",
  "nav.reviewQual": "Review qualification →",

  // Group card
  "group": "Group",
  "card.hint": "Drag to rank · Top 2 qualify",
  "pos.1": "1st",
  "pos.2": "2nd",
  "pos.3": "3rd",
  "pos.4": "4th",
  "card.groupAria": "Group {group} predictions",
  "card.reorderAria": "Reorder {team}, currently {pos} in group {group}",
  "card.moveUp": "Move {team} up",
  "card.moveDown": "Move {team} down",

  // Summary page
  "summary.title": "Who goes through",
  "summary.sub1": "Your 24 automatic qualifiers are locked in below. Now choose the ",
  "summary.sub2": "8 best third-placed teams",
  "summary.sub3": " to complete the 32. Tap a card to toggle.",
  "summary.warn": "Some groups aren't fully ranked yet.",
  "summary.warnLink": "Finish the group stage",
  "summary.warnEnd": "to unlock the bracket.",
  "summary.qualAria": "Group {group} qualifiers",
  "summary.advanceAria": "Advance {team} as a best third-placed team",
  "summary.removeAria": "Remove {team} as a best third-placed team",
  "third.in": "3rd · In",
  "third.q": "3rd?",
  "wildcards": "Wildcards:",
  "editGroups": "← Edit groups",
  "generate": "Generate knockout bracket →",

  // Bracket page
  "locked.title": "Bracket locked",
  "locked.sub":
    "Finish ranking all 12 groups and choose your 8 wildcards to generate the official Round of 32.",
  "locked.back": "Back to qualification",
  "ko.title": "Knockout stage",
  "ko.sub": "Tap a team to send them through. {done}/{total} matches called.",
  "ko.editQualifiers": "← Edit qualifiers",
  "ko.reveal": "Reveal your champion 🏆",
  "ko.revealLocked": "Pick every match to reveal your champion",
  "ko.roundsAria": "Knockout rounds",
  "ko.zoomIn": "Zoom in",
  "ko.zoomOut": "Zoom out",

  // Rounds
  "round.R32": "Round of 32",
  "round.R16": "Round of 16",
  "round.QF": "Quarter-finals",
  "round.SF": "Semi-finals",
  "round.TPP": "Third place",
  "round.F": "Final",

  // Match card
  "match.aria": "Match {id}",
  "match.pick": "Pick {team} to win",
  "match.picked": "Picked {team} to win",
  "match.awaiting": "Awaiting: {label}",

  // Champion page
  "noChamp.title": "No champion yet",
  "noChamp.sub": "Finish your bracket first.",
  "noChamp.back": "Back to the bracket",
  "champ.kicker": "Your 2026 World Champion",
  "champ.runnerUp": "Runner-up:",
  "champ.third": "Third:",
  "champ.confidence": "Confidence:",
  "champ.editBracket": "← Edit bracket",
  "champ.seeFull": "See full prediction →",

  // Dashboard
  "dash.kicker": "Your prediction",
  "dash.winItAll": "{team} win it all",
  "dash.wip": "Work in progress — {pct}%",
  "dash.share": "Share",
  "dash.copied": "Copied!",
  "dash.edit": "Edit",
  "dash.save": "Save",
  "stat.champion": "Champion",
  "stat.finalists": "Finalists",
  "stat.semis": "Semi-finalists",
  "stat.confidence": "Confidence",
  "dash.badges": "Badges",
  "dash.badgesAria": "Achievements",
  "dash.overview": "Bracket overview",
  "dash.groupRankings": "Group rankings",
  "dash.reset": "Reset prediction",
  "dash.resetConfirm": "Start over? This clears your entire prediction.",
  "dash.unlocked": "Unlocked.",
  "dash.locked": "Locked.",
  "share.champion":
    "🏆 My 2026 World Cup call: {flag} {team} lift the trophy at MetLife! Final: {final} · Confidence {score} ({label}). Think you can out-predict me? Stay in the game.",
  "share.wip":
    "I'm building my 2026 World Cup prediction — {pct}% done. Stay in the game.",
  "share.title": "My 2026 World Cup prediction",

  // Progress bar
  "progress.aria": "Prediction completion",

  // Promo form
  "promo.aria": "Setanta Bet Setanta Coins promotion",
  "promo.kicker": "Setanta Bet · Bonus play",
  "promo.title": "Guess a finalist, win 50 Setanta Coins",
  "promo.sub":
    "You've called your two finalists. If either reaches the real final, 50 Setanta Coins land on the Setanta Bet account associated with your phone number or email after the championship ends.",
  "promo.yourFinalists": "Your finalists",
  "promo.contactLabel": "Phone number or email",
  "promo.placeholder": "you@example.com or +995 5XX XX XX XX",
  "promo.hintInvalid": "Enter a valid email address or phone number.",
  "promo.hint": "Coins are credited to the Setanta Bet account matching this contact.",
  "promo.submit": "Claim my 50 Setanta Coins",
  "promo.submitting": "Submitting…",
  "promo.smallPrint": "25+ only. One entry per person. T&Cs apply. Please gamble responsibly.",
  "promo.done.title": "You're in!",
  "promo.done.backed": "You backed {t1} and {t2} to reach the final.",
  "promo.done.sub":
    "If you guessed a finalist right, 50 Setanta Coins will be waiting on the Setanta Bet account associated with your phone number or email after the championship ends.",
  "promo.done.smallPrint": "25+ only. T&Cs apply. Please gamble responsibly.",
  "promo.errGeneric": "Something went wrong. Try again.",
  "promo.errNetwork": "Network error — check your connection and try again.",
};

export type StringKey = keyof typeof en;

const ka: Record<StringKey, string> = {
  "hero.kicker": "კანადა · მექსიკა · აშშ — ზაფხული 2026",
  "hero.title1": "გამოიცანი ყველა მატჩი.",
  "hero.title2": "დაასახელე შენი ჩემპიონი.",
  "hero.sub":
    "48 გუნდი. 12 ჯგუფი. 104 მატჩი. იწინასწარმეტყველე მთელი მსოფლიო ჩემპიონატი — პირველი სასტვენიდან მეხიკოში ფინალამდე მეტლაიფის სტადიონზე — და დარჩი თამაშში მთელი ტურნირის განმავლობაში.",
  "hero.cta": "შექმენი შენი პროგნოზი →",
  "hero.meta": "სჭირდება დაახლოებით 5 წუთი · ინახება ავტომატურად · შეცვლა ნებისმიერ დროს",
  "how.aria": "როგორ მუშაობს",
  "step1.title": "დაალაგე ჯგუფები",
  "step1.copy": "გადაათრიე თითოეული გუნდი თავის ადგილზე, 1-დან 4-მდე, ყველა 12 ჯგუფში.",
  "step2.title": "აირჩიე პლეი-ოფი",
  "step2.copy": "შენი განლაგება ქმნის ოფიციალურ 32-ის რაუნდს. აირჩიე გამარჯვებულები ფინალამდე.",
  "step3.title": "გააზიარე შენი პროგნოზი",
  "step3.copy": "გამოავლინე შენი ჩემპიონი, აიღე საამაყო ბარათი და აიწიე ლიდერბორდზე.",

  "groups.title": "ჯგუფური ეტაპი",
  "groups.sub":
    "დაალაგე საბოლოო ადგილები ყველა ჯგუფისთვის. პირველი ორი გადის — მესამე ადგილოსანი შეიძლება მოხვდეს რვა საუკეთესო ვაილდქარდს შორის.",
  "groups.pagesAria": "ჯგუფების გვერდები",
  "groups.ranked": "{done}/12 ჯგუფი დალაგებულია",
  "nav.back": "← უკან",
  "nav.next": "შემდეგი →",
  "nav.review": "გადახედვა →",
  "nav.reviewQual": "კვალიფიკაციის გადახედვა →",

  "group": "ჯგუფი",
  "card.hint": "გადაათრიე დასალაგებლად · ტოპ 2 გადის",
  "pos.1": "1-ლი",
  "pos.2": "მე-2",
  "pos.3": "მე-3",
  "pos.4": "მე-4",
  "card.groupAria": "ჯგუფი {group} — პროგნოზები",
  "card.reorderAria": "გადაადგილე {team}, ამჟამად {pos} ჯგუფში {group}",
  "card.moveUp": "{team} ზევით",
  "card.moveDown": "{team} ქვევით",

  "summary.title": "ვინ გადის",
  "summary.sub1": "შენი 24 ავტომატური კვალიფიკანტი უკვე ჩაკეტილია. ახლა აირჩიე ",
  "summary.sub2": "8 საუკეთესო მესამე ადგილოსანი გუნდი",
  "summary.sub3": " 32-ის შესავსებად. დააჭირე ბარათს ასარჩევად.",
  "summary.warn": "ზოგიერთი ჯგუფი ჯერ ბოლომდე არ არის დალაგებული.",
  "summary.warnLink": "დაასრულე ჯგუფური ეტაპი",
  "summary.warnEnd": "ბრექეტის გასახსნელად.",
  "summary.qualAria": "ჯგუფი {group} — კვალიფიკანტები",
  "summary.advanceAria": "გაიყვანე {team} საუკეთესო მესამე ადგილოსნად",
  "summary.removeAria": "მოხსენი {team} საუკეთესო მესამე ადგილოსნებიდან",
  "third.in": "მე-3 · გადის",
  "third.q": "მე-3?",
  "wildcards": "ვაილდქარდები:",
  "editGroups": "← ჯგუფების შეცვლა",
  "generate": "პლეი-ოფის გენერაცია →",

  "locked.title": "ბრექეტი დაკეტილია",
  "locked.sub":
    "დაასრულე 12-ვე ჯგუფის დალაგება და აირჩიე 8 ვაილდქარდი ოფიციალური 32-ის რაუნდის შესაქმნელად.",
  "locked.back": "კვალიფიკაციაზე დაბრუნება",
  "ko.title": "პლეი-ოფი",
  "ko.sub": "დააჭირე გუნდს შემდეგ ეტაპზე გასაყვანად. არჩეულია {done}/{total} მატჩი.",
  "ko.editQualifiers": "← კვალიფიკანტების შეცვლა",
  "ko.reveal": "გამოავლინე შენი ჩემპიონი 🏆",
  "ko.revealLocked": "აირჩიე ყველა მატჩი ჩემპიონის გამოსავლენად",
  "ko.roundsAria": "პლეი-ოფის რაუნდები",
  "ko.zoomIn": "მიახლოება",
  "ko.zoomOut": "დაშორება",

  "round.R32": "32-ის რაუნდი",
  "round.R16": "16-ის რაუნდი",
  "round.QF": "მეოთხედფინალები",
  "round.SF": "ნახევარფინალები",
  "round.TPP": "მესამე ადგილი",
  "round.F": "ფინალი",

  "match.aria": "მატჩი {id}",
  "match.pick": "აირჩიე {team} გამარჯვებულად",
  "match.picked": "არჩეულია {team} გამარჯვებულად",
  "match.awaiting": "მოლოდინში: {label}",

  "noChamp.title": "ჩემპიონი ჯერ არ არის",
  "noChamp.sub": "ჯერ დაასრულე შენი ბრექეტი.",
  "noChamp.back": "ბრექეტზე დაბრუნება",
  "champ.kicker": "შენი 2026 წლის მსოფლიო ჩემპიონი",
  "champ.runnerUp": "ვიცე-ჩემპიონი:",
  "champ.third": "მესამე:",
  "champ.confidence": "თავდაჯერებულობა:",
  "champ.editBracket": "← ბრექეტის შეცვლა",
  "champ.seeFull": "სრული პროგნოზი →",

  "dash.kicker": "შენი პროგნოზი",
  "dash.winItAll": "{team} იქნება ჩემპიონი",
  "dash.wip": "მუშავდება — {pct}%",
  "dash.share": "გაზიარება",
  "dash.copied": "დაკოპირდა!",
  "dash.edit": "შეცვლა",
  "dash.save": "შენახვა",
  "stat.champion": "ჩემპიონი",
  "stat.finalists": "ფინალისტები",
  "stat.semis": "ნახევარფინალისტები",
  "stat.confidence": "თავდაჯერებულობა",
  "dash.badges": "ბეჯები",
  "dash.badgesAria": "მიღწევები",
  "dash.overview": "ბრექეტის მიმოხილვა",
  "dash.groupRankings": "ჯგუფების განლაგება",
  "dash.reset": "პროგნოზის განულება",
  "dash.resetConfirm": "თავიდან დაწყება? ეს წაშლის მთელ შენს პროგნოზს.",
  "dash.unlocked": "გახსნილია.",
  "dash.locked": "დაკეტილია.",
  "share.champion":
    "🏆 ჩემი 2026 მუნდიალის პროგნოზი: {flag} {team} აიღებს თასს მეტლაიფზე! ფინალი: {final} · თავდაჯერებულობა {score} ({label}). გგონია, უკეთ გამოიცნობ? დარჩი თამაშში.",
  "share.wip":
    "ვაწყობ ჩემს 2026 მუნდიალის პროგნოზს — {pct}% მზადაა. დარჩი თამაშში.",
  "share.title": "ჩემი 2026 მუნდიალის პროგნოზი",

  "progress.aria": "პროგნოზის შევსების პროგრესი",

  "promo.aria": "სეტანტა ბეთის სეტანტა ქოინების აქცია",
  "promo.kicker": "სეტანტა ბეთი · ბონუს თამაში",
  "promo.title": "გამოიცანი ფინალისტი, მოიგე 50 სეტანტა ქოინი",
  "promo.sub":
    "შენ უკვე დაასახელე ორი ფინალისტი. თუ რომელიმე მათგანი ნამდვილ ფინალში გავა, 50 სეტანტა ქოინი დაგხვდება სეტანტა ბეთის ანგარიშზე, რომელიც შენს ტელეფონის ნომერთან ან ელფოსტასთან არის დაკავშირებული, ჩემპიონატის დასრულების შემდეგ.",
  "promo.yourFinalists": "შენი ფინალისტები",
  "promo.contactLabel": "ტელეფონის ნომერი ან ელფოსტა",
  "promo.placeholder": "you@example.com ან +995 5XX XX XX XX",
  "promo.hintInvalid": "შეიყვანე სწორი ელფოსტა ან ტელეფონის ნომერი.",
  "promo.hint": "ქოინები ჩაირიცხება ამ კონტაქტთან დაკავშირებულ სეტანტა ბეთის ანგარიშზე.",
  "promo.submit": "მივიღო ჩემი 50 სეტანტა ქოინი",
  "promo.submitting": "იგზავნება…",
  "promo.smallPrint":
    "მხოლოდ 25+. ერთი მონაწილეობა თითო პირზე. მოქმედებს წესები და პირობები. ითამაშე პასუხისმგებლობით.",
  "promo.done.title": "შენ თამაშში ხარ!",
  "promo.done.backed": "შენ დაასახელე {t1} და {t2} ფინალისტებად.",
  "promo.done.sub":
    "თუ ფინალისტი სწორად გამოიცანი, 50 სეტანტა ქოინი დაგხვდება სეტანტა ბეთის ანგარიშზე, რომელიც შენს ტელეფონის ნომერთან ან ელფოსტასთან არის დაკავშირებული, ჩემპიონატის დასრულების შემდეგ.",
  "promo.done.smallPrint": "მხოლოდ 25+. მოქმედებს წესები და პირობები. ითამაშე პასუხისმგებლობით.",
  "promo.errGeneric": "რაღაც შეცდომა მოხდა. სცადე თავიდან.",
  "promo.errNetwork": "ქსელის შეცდომა — შეამოწმე კავშირი და სცადე თავიდან.",
};

const STRINGS: Record<Lang, Record<StringKey, string>> = { en, ka };

/* ── Team names ───────────────────────────────────────────────────── */

const TEAM_NAMES_KA: Record<string, string> = {
  MEX: "მექსიკა", RSA: "სამხრეთ აფრიკა", KOR: "სამხრეთ კორეა", CZE: "ჩეხეთი",
  CAN: "კანადა", BIH: "ბოსნია და ჰერცეგოვინა", QAT: "კატარი", SUI: "შვეიცარია",
  BRA: "ბრაზილია", MAR: "მაროკო", HAI: "ჰაიტი", SCO: "შოტლანდია",
  USA: "აშშ", PAR: "პარაგვაი", AUS: "ავსტრალია", TUR: "თურქეთი",
  GER: "გერმანია", CUW: "კიურასაო", CIV: "კოტ-დივუარი", ECU: "ეკვადორი",
  NED: "ნიდერლანდები", JPN: "იაპონია", SWE: "შვედეთი", TUN: "ტუნისი",
  BEL: "ბელგია", EGY: "ეგვიპტე", IRN: "ირანი", NZL: "ახალი ზელანდია",
  ESP: "ესპანეთი", CPV: "კაბო-ვერდე", KSA: "საუდის არაბეთი", URU: "ურუგვაი",
  FRA: "საფრანგეთი", SEN: "სენეგალი", IRQ: "ერაყი", NOR: "ნორვეგია",
  ARG: "არგენტინა", ALG: "ალჟირი", AUT: "ავსტრია", JOR: "იორდანია",
  POR: "პორტუგალია", COD: "კონგოს დრ", UZB: "უზბეკეთი", COL: "კოლუმბია",
  ENG: "ინგლისი", CRO: "ხორვატია", GHA: "განა", PAN: "პანამა",
};

/* ── Achievements & confidence labels ─────────────────────────────── */

const ACHIEVEMENTS_KA: Record<string, { title: string; description: string }> = {
  "first-group": { title: "პირველი სასტვენი", description: "დაალაგე პირველი ჯგუფი" },
  "all-groups": { title: "ჯგუფების გურუ", description: "დაალაგე ყველა 12 ჯგუფი" },
  "thirds-picked": { title: "ვაილდქარდების ოსტატი", description: "აირჩიე 8 საუკეთესო მესამე ადგილოსანი" },
  "r32-done": { title: "ნოკაუტის არტისტი", description: "დაასრულე 32-ის რაუნდი" },
  "r16-done": { title: "ტკბილი თექვსმეტი", description: "დაასრულე 16-ის რაუნდი" },
  "qf-done": { title: "ელიტური რვიანი", description: "დაასრულე მეოთხედფინალები" },
  "sf-done": { title: "ფინალური ოთხეული", description: "დაასრულე ნახევარფინალები" },
  "champion": { title: "ბროლის ბურთი", description: "დაასახელე შენი ჩემპიონი" },
  "chaos": { title: "ქაოსის აგენტი", description: "დაასრულე 40-ზე ნაკლები თავდაჯერებულობით" },
  "chalk": { title: "ფავორიტების ოსტატი", description: "დაასრულე 80-ზე მეტი თავდაჯერებულობით" },
};

const CONF_LABELS_KA: Record<string, string> = {
  "No picks yet": "ჯერ არჩევანი არ არის",
  "Chalk Master": "ფავორიტების ოსტატი",
  "Calculated Risk": "გათვლილი რისკი",
  "Bold Caller": "თამამი პროგნოზისტი",
  "Agent of Chaos": "ქაოსის აგენტი",
};

/* ── Hook ─────────────────────────────────────────────────────────── */

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Translate the English slot labels produced by lib/bracket.ts. */
function translateSlotLabel(label: string, lang: Lang): string {
  if (lang === "en") return label;
  let m = label.match(/^Winner Group (\w)$/);
  if (m) return `ჯგუფ ${m[1]}-ის გამარჯვებული`;
  m = label.match(/^Runner-up Group (\w)$/);
  if (m) return `ჯგუფ ${m[1]}-ის მეორე ადგილი`;
  m = label.match(/^3rd — Group (.+)$/);
  if (m) return `მე-3 — ჯგუფი ${m[1]}`;
  m = label.match(/^Winner M(\d+)$/);
  if (m) return `M${m[1]}-ის გამარჯვებული`;
  m = label.match(/^Loser M(\d+)$/);
  if (m) return `M${m[1]}-ის წაგებული`;
  return label;
}

export function useT() {
  const lang = useLanguage((s) => s.lang);
  const dict = STRINGS[lang];

  return {
    lang,
    t: (key: StringKey, vars?: Record<string, string | number>) =>
      interpolate(dict[key], vars),
    /** Localized team name. */
    tn: (team: Team) => (lang === "ka" ? TEAM_NAMES_KA[team.id] ?? team.name : team.name),
    /** Localized round label. */
    round: (r: Round) => dict[`round.${r}` as StringKey],
    /** Localized bracket slot label ("Winner Group C", …). */
    slot: (label: string) => translateSlotLabel(label, lang),
    /** Localized achievement title/description. */
    ach: (id: string, title: string, description: string) =>
      lang === "ka" ? ACHIEVEMENTS_KA[id] ?? { title, description } : { title, description },
    /** Localized confidence label. */
    conf: (label: string) => (lang === "ka" ? CONF_LABELS_KA[label] ?? label : label),
  };
}
