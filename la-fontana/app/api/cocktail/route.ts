/**
 * =============================================================================
 * API ROUTE: /api/cocktail — Cocktail per categoria (legacy)
 * =============================================================================
 * Route che restituisce i cocktail raggruppati per categoria.
 * Usa JOIN con categorie_cocktail per ottenere il nome categoria.
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sanitizeRows } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cocktail = await sql`
      SELECT c.id, c.nome, c.descrizione, c.prezzo, c.disponibile, c.ordine,
             cat.nome AS categoria
      FROM cocktail c
      JOIN categorie_cocktail cat ON c.categoria_id = cat.id
      WHERE c.disponibile = true
      ORDER BY cat.ordine, c.ordine
    `;

    const datiPuliti = sanitizeRows(cocktail);

    return NextResponse.json(datiPuliti);
  } catch (err) {
    console.error('Errore API /api/cocktail:', err);
    return NextResponse.json(
      { error: 'Impossibile caricare i cocktail. Riprova tra poco.' },
      { status: 500 }
    );
  }
}