/**
 * =============================================================================
 * LAYOUT PRINCIPALE — app/layout.tsx
 * =============================================================================
 * Questo è il "wrapper" di TUTTE le pagine del sito.
 * Qui definiamo:
 * - I font Google (Playfair Display per titoli, Inter per testo)
 * - I metadati SEO (titolo, descrizione per Google)
 * - La lingua del sito (italiano)
 * - Il CSS globale
 * 
 * PERCHÉ DUE FONT:
 * - Playfair Display: font serif elegante per titoli → sensazione "luxury"
 * - Inter: font sans-serif moderno e leggibile per il corpo del testo
 * 
 * PER MODIFICARE:
 * - Titolo del sito: cambia `title` in metadata
 * - Descrizione Google: cambia `description` in metadata
 * - Font: cambia le importazioni e le variabili CSS
 * =============================================================================
 */

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Font per i titoli — serif elegante, stile luxury
// `variable` crea una variabile CSS (--font-display) usabile ovunque nel CSS
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",          // "swap" = mostra il testo subito, poi cambia font quando caricato
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Font per il corpo del testo — sans-serif moderno e leggibile
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Metadati SEO — questi appaiono su Google e nei social quando si condivide il link
export const metadata: Metadata = {
  title: "La Fontana — Cocktail Bar & Cucina | Strongoli Marina",
  description:
    "Aperitivo, cucina e cocktail bar a Strongoli Marina. Gin premium, hamburger artigianali e atmosfera unica su Piazza Magna Grecia.",
  keywords: ["La Fontana", "Strongoli Marina", "cocktail bar", "ristorante", "gin tonica", "aperitivo"],
  openGraph: {
    title: "La Fontana — Cocktail Bar & Cucina",
    description: "Aperitivo, cucina e cocktail a Strongoli Marina",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="it" — fondamentale per SEO e accessibilità (dice al browser che il contenuto è in italiano)
    <html
      lang="it"
      className={`${playfair.variable} ${inter.variable}`}
    >
      {/* 
        min-h-screen: altezza minima = schermo intero
        flex flex-col: layout verticale (navbar → contenuto → footer)
        antialiased: rendering del testo più fluido
      */}
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
