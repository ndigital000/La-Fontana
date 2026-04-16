/**
 * =============================================================================
 * API ROUTE: /api/bevande — Birre e Soft Drinks
 * =============================================================================
 * Restituisce tutte le bevande disponibili dalla tabella `bevande`.
 * Struttura semplice: nome, prezzo, nota (formato/dettagli).
 * 
 * PER MODIFICARE:
 * - Aggiungere una birra: INSERT INTO bevande (nome, prezzo, nota, ordine) VALUES (...)
 * - Cambiare prezzo: UPDATE bevande SET prezzo = X WHERE nome = '...'
 * - Nascondere: UPDATE bevande SET disponibile = false WHERE id = X
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sanitizeRows } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bevande = await sql`
      SELECT id, nome, prezzo, nota, ordine
      FROM bevande
      WHERE disponibile = true
      ORDER BY ordine
    `;

    return NextResponse.json({
      bevande: sanitizeRows(bevande)
    });

  } catch (err) {
    console.error('❌ Errore API /api/bevande:', err);
    return NextResponse.json(
      { error: 'Impossibile caricare le bevande. Riprova tra poco.' },
      { status: 500 }
    );
  }
}
