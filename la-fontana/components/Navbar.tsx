/**
 * =============================================================================
 * NAVBAR — components/Navbar.tsx
 * =============================================================================
 * La barra di navigazione fissa in alto. Funzionalità:
 * 
 * 1. EFFETTO SCROLL: quando l'utente scorre > 50px, lo sfondo diventa
 *    semi-trasparente con blur (effetto "glass morphism")
 * 
 * 2. LINK DI NAVIGAZIONE: Menu, Cocktail, Bevande, Contatti
 *    Ogni link ha un underline animato che appare da sinistra al hover
 * 
 * 3. MENU HAMBURGER (mobile): sotto 768px i link scompaiono e appare
 *    un'icona hamburger che apre un overlay a schermo pieno
 * 
 * 4. ANIMAZIONI: Framer Motion per il fade-in iniziale
 * 
 * PER MODIFICARE:
 * - Per aggiungere un link: aggiungi un oggetto all'array `links`
 * - Per cambiare il logo: modifica il testo in .navbar-logo
 * =============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Array dei link di navigazione
// label = testo visibile, href = ID della sezione con #
const links = [
  { label: 'Menu', href: '#menu' },
  { label: 'Cocktail', href: '#cocktail' },
  { label: 'Bevande', href: '#sez-bevande' },
  { label: 'Contatti', href: '#contatti' },
];

export default function Navbar() {
  // Stato: true quando l'utente ha scrollato > 50px
  const [scrolled, setScrolled] = useState(false);

  // Stato: true quando il menu mobile è aperto
  const [menuOpen, setMenuOpen] = useState(false);

  // Effetto: ascolta l'evento scroll della finestra
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    // Cleanup: rimuove il listener quando il componente si smonta
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Funzione: chiude il menu mobile e scrolla alla sezione
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ========= NAVBAR PRINCIPALE ========= */}
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        // Animazione iniziale: la navbar appare dall'alto con fade
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo — cliccabile, torna all'inizio della pagina */}
        <a href="#home" className="navbar-logo">La Fontana</a>

        {/* Link desktop — nascosti su mobile via CSS (.navbar-links display:none sotto 768px) */}
        <div className="navbar-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Hamburger — visibile solo su mobile via CSS (.hamburger display:flex sotto 768px) */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu di navigazione"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      {/* ========= MENU MOBILE (overlay a schermo pieno) ========= */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={handleNavClick}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}