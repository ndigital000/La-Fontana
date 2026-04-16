/**
 * =============================================================================
 * CONTATTI — components/Contatti.tsx
 * =============================================================================
 * Sezione con informazioni di contatto e mappa Google Maps.
 * 
 * CONTENUTO:
 * - Indirizzo del locale
 * - Orari di apertura
 * - Google Maps embed centrato su Piazza Magna Grecia, Strongoli Marina
 * - Pulsante "Lascia una Recensione" (link placeholder)
 * 
 * GOOGLE MAPS EMBED:
 * L'iframe usa l'API di embed gratuita di Google Maps.
 * Il filtro CSS (grayscale + brightness) lo rende "dark" in linea col design.
 * Al hover, la mappa torna colorata per interazione.
 * 
 * PER MODIFICARE:
 * - Orari: cambia i testi nelle div .contatti-item
 * - Mappa: modifica la query nell'URL dell'iframe (dopo "q=")
 * - Link recensione: sostituisci "#" con il link Google My Business
 * =============================================================================
 */

'use client';

import { motion } from 'framer-motion';

export default function Contatti() {
  return (
    <section id="contatti" className="contatti-section">
      {/* ========= TITOLO ========= */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: '3rem' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">— Dove siamo —</p>
        <h2 className="section-title">
          <em>Contatti</em>
        </h2>
        <div className="divider" />
      </motion.div>

      {/* ========= GRIGLIA INFO + MAPPA ========= */}
      <motion.div
        className="contatti-grid"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Colonna sinistra: informazioni */}
        <div className="contatti-info">
          {/* Indirizzo */}
          <div className="contatti-item">
            <span className="contatti-item-label">📍 Indirizzo</span>
            <span className="contatti-item-value">Piazza Magna Grecia</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Strongoli Marina (KR)
            </span>
          </div>

          {/* Orari */}
          <div className="contatti-item">
            <span className="contatti-item-label">🕐 Orari</span>
            <span className="contatti-item-value">18:00 — 02:00</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Aperto tutti i giorni in stagione
            </span>
          </div>

          {/* Tipo locale */}
          <div className="contatti-item">
            <span className="contatti-item-label">🍸 La Fontana</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Cocktail bar &amp; cucina nel cuore di Strongoli Marina. 
              Gin premium, hamburger artigianali e atmosfera unica.
            </span>
          </div>

          {/* Pulsante Lascia una Recensione */}
          <motion.a
            href="#"
            className="btn-review"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            ⭐ Lascia una Recensione
          </motion.a>
        </div>

        {/* Colonna destra: Google Maps */}
        <div className="contatti-map">
          {/*
            IFRAME GOOGLE MAPS:
            - "q=" è la query di ricerca (il luogo da mostrare)
            - "&z=16" è il livello di zoom (15-18 per quartieri)
            - "&output=embed" attiva la modalità embed
            - loading="lazy" = carica la mappa solo quando l'utente scrolla fino a qui
            
            Il filtro CSS in globals.css rende la mappa dark (grayscale + brightness bassa)
          */}
          <iframe
            src="https://maps.google.com/maps?q=Piazza+Magna+Grecia,+Strongoli+Marina&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="La Fontana — Piazza Magna Grecia, Strongoli Marina"
            allowFullScreen
          />
        </div>
      </motion.div>
    </section>
  );
}