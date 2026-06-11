import type { Metadata } from "next";
import { ProgressBar } from "@/components/ProgressBar";
import { AchievementToast } from "@/components/AchievementToast";

export const metadata: Metadata = {
  title: "WorldCup2026 Bracket Predictor",
  description:
    "Build your World Cup 2026 prediction with the Setanta Bet predictor — rank all 12 groups, call every knockout match and crown your champion. Guess a finalist, win 50 free spins.",
};

export default function PredictLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <ProgressBar />
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-6">{children}</div>
      <AchievementToast />
    </div>
  );
}
