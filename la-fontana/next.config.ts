/**
 * =============================================================================
 * NEXT.CONFIG.TS — Configurazione Next.js + Security Headers
 * =============================================================================
 * Questo file configura:
 * 1. Turbopack root — risolve warning sui lockfile multipli
 * 2. Security Headers — protezione contro attacchi comuni
 * 3. Configurazione immagini — domini consentiti per le immagini esterne
 * 
 * SECURITY HEADERS SPIEGATI:
 * - X-Content-Type-Options: previene il "MIME sniffing" (il browser non indovina il tipo file)
 * - X-Frame-Options: impedisce di incorniciare il sito in iframe malevoli (clickjacking)
 * - X-XSS-Protection: attiva il filtro XSS built-in dei browser
 * - Referrer-Policy: controlla quali info vengono inviate quando si clicca un link esterno
 * - Permissions-Policy: blocca l'accesso a webcam, microfono, geolocalizzazione
 * 
 * PER MODIFICARE:
 * - Per bloccare iframe completamente: cambia X-Frame-Options a "DENY"
 * - Per aggiungere domini immagini: aggiungi a remotePatterns
 * =============================================================================
 */

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Security headers — applicati a TUTTE le risposte del server
  async headers() {
    return [
      {
        // "/(.*)" = ogni pagina e risorsa del sito
        source: "/(.*)",
        headers: [
          {
            // Impedisce al browser di "indovinare" il tipo di file
            // Es: un file .txt non verrà mai eseguito come .js
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Impedisce che il sito venga incorniciato in un iframe esterno
            // SAMEORIGIN permette preview Vercel ma blocca iframe da altri domini
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            // Attiva il filtro anti-XSS del browser
            // Se il browser rileva un attacco XSS, blocca la pagina
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            // Quando un utente clicca un link esterno dal tuo sito,
            // invia solo l'origine (dominio) e non l'URL completo
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Blocca l'accesso a webcam, microfono e GPS
            // Non servono per un sito ristorante
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            // Content Security Policy — controlla quali risorse possono essere caricate
            // unsafe-eval necessario per Three.js, unsafe-inline per stili Tailwind
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://maps.gstatic.com https://maps.googleapis.com",
              "connect-src 'self' https://*.neon.tech https://maps.googleapis.com",
              "worker-src blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src https://maps.google.com https://www.google.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Domini consentiti per immagini esterne (es. Unsplash per l'hero)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
