import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default:
      "Setanta Bet World Cup 2026 Predictor — Guess the Finalists, Win 50 Free Spins",
    template: "%s | Setanta Bet World Cup 2026 Predictor",
  },
  description:
    "The official Setanta Bet World Cup 2026 bracket predictor. Predict every group, every knockout and the champion of WorldCup2026 — guess a finalist and win 50 free spins on Setanta Bet. 48 teams. 104 matches. Stay in the game.",
  keywords: [
    "Setanta",
    "Setanta Bet",
    "Setanta-Bet",
    "World Cup",
    "WorldCup",
    "WorldCup2026",
    "World Cup 2026",
    "FIFA World Cup 2026",
    "predictor",
    "World Cup predictor",
    "bracket predictor",
    "World Cup bracket",
    "free spin",
    "free spins",
    "freespin",
    "football predictions",
  ],
  applicationName: "Setanta Bet World Cup 2026 Predictor",
  category: "sports",
  alternates: {
    languages: { en: "/", ka: "/" },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Setanta Bet World Cup 2026 Predictor",
    title: "Setanta Bet World Cup 2026 Predictor — Win 50 Free Spins",
    description:
      "Predict the entire WorldCup2026 bracket with the Setanta Bet predictor. Guess a finalist right and collect 50 free spins after the championship ends. 48 teams. 104 matches. One champion.",
    locale: "en_US",
    alternateLocale: ["ka_GE"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Setanta Bet World Cup 2026 Predictor — Win 50 Free Spins",
    description:
      "Predict the full WorldCup2026 bracket. Guess a finalist, win 50 free spins on Setanta Bet.",
  },
};

/** Structured data for rich results (WebApplication + promotion offer). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Setanta Bet World Cup 2026 Predictor",
  alternateName: ["Setanta WorldCup2026 Predictor", "Setanta-Bet World Cup Bracket"],
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  inLanguage: ["en", "ka"],
  description:
    "Free World Cup 2026 bracket predictor by Setanta Bet. Predict groups, knockouts and the champion — guess a finalist and win 50 free spins.",
  keywords:
    "Setanta, Setanta-Bet, WorldCup, predictor, WorldCup2026, freespin, free spins, World Cup 2026 bracket",
  offers: {
    "@type": "Offer",
    name: "Guess a finalist — 50 free spins on Setanta Bet",
    price: "0",
    priceCurrency: "USD",
  },
  publisher: { "@type": "Organization", name: "Setanta Bet" },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-chip focus:bg-volt focus:px-4 focus:py-2 focus:text-pitch-950"
        >
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
