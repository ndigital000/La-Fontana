/**
 * =============================================================================
 * COOKIE BANNER — components/CookieBanner.tsx
 * =============================================================================
 * Banner GDPR per il consenso ai cookie. Funzionalità:
 * 
 * 1. APPARE solo al primo caricamento del sito
 * 2. SALVA la preferenza dell'utente in localStorage
 * 3. NON RIAPPARE dopo l'accettazione/rifiuto (finché localStorage non viene pulito)
 * 4. DESIGN minimale dark, non invasivo, posizionato in basso
 * 
 * COME FUNZIONA IL CONSENSO:
 * - "Accetta tutti": salva 'accepted' → consente cookie analitici/marketing
 * - "Solo necessari": salva 'declined' → solo cookie tecnici (quelli che servono al sito)
 * - In entrambi i casi il banner scompare e non riappare
 * 
 * CHIAVE LOCALSTORAGE: 'la-fontana-cookie-consent'
 * VALORI POSSIBILI: 'accepted', 'declined', o assente (non ha ancora scelto)
 * 
 * PER MODIFICARE:
 * - Testo del banner: cambia la stringa nel <p className="cookie-text">
 * - Link privacy: sostituisci "#" con l'URL della pagina privacy
 * - Per resettare il consenso (test): apri DevTools → Application → localStorage → cancella la chiave
 * =============================================================================
 */

'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  // null = non abbiamo ancora controllato localStorage (evita flash del banner su SSR)
  // true = il banner è visibile
  // false = il banner è nascosto (utente ha già scelto)
  const [visibile, setVisibile] = useState<boolean | null>(null);

  // Al montaggio: controlla se l'utente ha già dato il consenso
  useEffect(() => {
    // Legge la preferenza salvata
    const consenso = localStorage.getItem('la-fontana-cookie-consent');
    // Se non c'è nessuna preferenza salvata, mostra il banner
    setVisibile(!consenso);
  }, []);

  // Funzione chiamata quando l'utente clicca un pulsante
  const handleConsent = (tipo: 'accepted' | 'declined') => {
    // Salva la preferenza — non verrà chiesta di nuovo
    localStorage.setItem('la-fontana-cookie-consent', tipo);
    // Nascondi il banner con animazione
    setVisibile(false);
  };

  // Non renderizzare nulla finché non abbiamo controllato localStorage
  // Questo evita il "flash" del banner durante l'idratazione React
  if (visibile === null || visibile === false) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consenso cookie">
      <p className="cookie-text">
        Questo sito utilizza cookie tecnici per garantire il corretto funzionamento.
        Accettando, consenti l&apos;uso di cookie analitici per migliorare l&apos;esperienza.{' '}
        <a href="#">Scopri di più</a>
      </p>
      <div className="cookie-buttons">
        {/* Pulsante "Solo necessari" — accetta solo cookie tecnici */}
        <button
          className="cookie-btn decline"
          onClick={() => handleConsent('declined')}
        >
          Solo necessari
        </button>
        {/* Pulsante "Accetta tutti" — accetta anche cookie analitici */}
        <button
          className="cookie-btn accept"
          onClick={() => handleConsent('accepted')}
        >
          Accetta tutti
        </button>
      </div>
    </div>
  );
}
