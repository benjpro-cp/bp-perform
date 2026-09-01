import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BP Perform | Coaching Elite",
  description:
    "Coaching sportif premium. Musculation, perte de poids, suivi personnalisé. Forge ton excellence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${oswald.variable} dark`}>
      <body className="bg-bg text-white antialiased">{children}</body>
    </html>
  );
}
