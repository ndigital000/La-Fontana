/**
 * =============================================================================
 * API ROUTE: /api/menu — Piatti del Menu
 * =============================================================================
 * Questa route gestisce le richieste GET per ottenere la lista dei piatti.
 * 
 * FLUSSO:
 * 1. Il componente Menu.tsx fa: fetch('/api/menu')
 * 2. Questa route esegue una query SQL alla tabella `piatti` + `categorie`
 * 3. I risultati vengono sanitizzati (sicurezza XSS)
 * 4. Restituisce un JSON con i piatti raggruppabili per categoria
 * 
 * QUERY SQL SPIEGATA:
 * - SELECT: prende tutti i campi di piatti + il nome della categoria
 * - JOIN: collega ogni piatto alla sua categoria tramite categoria_id
 * - WHERE disponibile = true: mostra solo i piatti attivi
 * - ORDER BY: ordina per categoria (ordine), poi per piatto (ordine)
 * 
 * PER MODIFICARE:
 * - Per nascondere un piatto: nel DB, metti disponibile = false
 * - Per cambiare l'ordine: modifica il campo "ordine" nel DB
 * - Per aggiungere un piatto: INSERT nella tabella piatti
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sanitizeRows } from '@/lib/sanitize';

// Forza la route a essere dinamica (non cachata a build time)
// perché i dati del menu possono cambiare nel database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Query: prendi tutti i piatti disponibili con la loro categoria
    const piatti = await sql`
      SELECT 
        p.id,
        p.nome,
        p.descrizione,
        p.prezzo,
        p.orario,
        p.tag,
        p.glb,
        p.ordine,
        cat.nome AS categoria
      FROM piatti p
      JOIN categorie cat ON p.categoria_id = cat.id
      WHERE p.disponibile = true
      ORDER BY cat.ordine, p.ordine
    `;

    // Sanitizza i dati prima di inviarli al client (sicurezza XSS)
    const datiPuliti = sanitizeRows(piatti);

    // Estrai anche la lista unica delle categorie per i tab del menu
    const categorie = [...new Set(datiPuliti.map((p: Record<string, unknown>) => p.categoria as string))];

    // Restituisci sia i piatti che le categorie
    return NextResponse.json({
      piatti: datiPuliti,
      categorie: categorie
    });

  } catch (err) {
    // Se il database è down o la query fallisce, logga l'errore
    // ma restituisci un messaggio generico al client (non esporre dettagli)
    console.error('❌ Errore API /api/menu:', err);
    return NextResponse.json(
      { error: 'Impossibile caricare il menu. Riprova tra poco.' },
      { status: 500 }
    );
  }
}