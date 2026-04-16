/**
 * =============================================================================
 * FOOTER — components/Footer.tsx
 * =============================================================================
 * Piè di pagina del sito con:
 * - Nome del locale e tagline
 * - Link rapidi alle sezioni
 * - Copyright con anno dinamico
 * 
 * PER MODIFICARE:
 * - Testi: cambia direttamente le stringhe nel JSX
 * - Link: aggiungi/rimuovi dall'array footerLinks
 * - L'anno nel copyright si aggiorna automaticamente
 * =============================================================================
 */

'use client';

import { motion } from 'framer-motion';

// Link del footer — label = testo, href = ID sezione
const footerLinks = [
  { label: 'Menu', href: '#menu' },
  { label: 'Cocktail', href: '#cocktail' },
  { label: 'Bevande', href: '#sez-bevande' },
  { label: 'Contatti', href: '#contatti' },
];

export default function Footer() {
  return (
    <motion.footer
      className="site-footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-inner">
        {/* Brand e tagline */}
        <div>
          <div className="footer-brand">La Fontana</div>
          <p className="footer-tagline">Cocktail Bar &amp; Cucina · Strongoli Marina</p>
        </div>

        {/* Link rapidi */}
        <ul className="footer-links">
          {footerLinks.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Copyright — l'anno si aggiorna automaticamente */}
        <div className="footer-copyright">
          © {new Date().getFullYear()} La Fontana — Piazza Magna Grecia, Strongoli Marina. Tutti i diritti riservati.
        </div>
      </div>
    </motion.footer>
  );
}