/**
 * =============================================================================
 * HERO — components/Hero.tsx
 * =============================================================================
 * La sezione di "benvenuto" che occupa tutto lo schermo.
 * 
 * STRUTTURA VISUALE (dall'indietro in avanti):
 * 1. Foto di sfondo (Unsplash — cocktail bar)
 * 2. Overlay scuro (gradiente — rende leggibile il testo)
 * 3. Contenuto (badge, titolo, sottotitolo, bottoni CTA)
 * 4. Scroll indicator (animazione "scorri" in basso)
 * 
 * ANIMAZIONI FRAMER MOTION:
 * - Ogni elemento appare con un leggero ritardo (stagger)
 * - Il badge arriva dall'alto, il titolo dal basso, i bottoni sfumano
 * - Tutto è gestito da motion.div con le proprietà initial → animate
 * 
 * PER MODIFICARE:
 * - Foto sfondo: cambia l'URL in .hero-bg (usa Unsplash o una foto locale)
 * - Testi: modifica direttamente le stringhe nel JSX
 * - Link bottoni: cambia gli href (#menu, #cocktail, #sez-bevande)
 * =============================================================================
 */

'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home" className="hero">

      {/* ========= LIVELLO 1: Foto di sfondo ========= */}
      <div className="hero-bg" />

      {/* ========= LIVELLO 2: Overlay scuro con gradiente ========= */}
      <div className="hero-overlay" />

      {/* ========= LIVELLO 3: Contenuto principale ========= */}
      <div className="hero-content">



        {/* Titolo principale — "La Fontana" */}
        <motion.h1
          className="hero-title"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          La <em>Fontana</em>
        </motion.h1>

        {/* Sottotitolo — tipo di locale */}
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Aperitivo · Cucina · Cocktail
        </motion.p>

        {/* Indirizzo */}
        <motion.p
          className="hero-address"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Piazza Magna Grecia, Strongoli Marina
        </motion.p>

        {/* Divisore decorativo */}
        <motion.div
          className="divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ marginBottom: '2rem' }}
        />

        {/* Bottoni CTA — portano alle sezioni del sito */}
        <motion.div
          className="hero-cta"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {/* Bottone primario — sfondo pieno */}
          <a href="#menu" className="btn-primary">Scopri il Menu</a>

          {/* Bottone secondario — solo bordo */}
          <a href="#cocktail" className="btn-outline">I Nostri Cocktail</a>

          {/* Bottone terziario — bordo più tenue */}
          <a href="#sez-bevande" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
            Birre &amp; Soft Drinks
          </a>
        </motion.div>
      </div>

      {/* ========= LIVELLO 4: Scroll indicator ========= */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span>Scorri</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
}