/**
 * =============================================================================
 * API ROUTE: /api/cocktails — Cocktail e Gin
 * =============================================================================
 * Restituisce tutti i cocktail con i campi specifici per la logica Gin:
 * - sezione: "Gin Premium", "Gin Standard", "Cocktail"
 * - varianti: le opzioni disponibili (es. "Lemon · Tonica")
 * - prezzo_tonica: prezzo con acqua tonica
 * - nota: tipo di tonica/lemon (es. "Fever Tree")
 * 
 * Il componente Cocktail.tsx usa la "sezione" per filtrare e visualizzare
 * correttamente i gin premium con la scelta Lemon/Tonica + Fever Tree.
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sanitizeRows } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cocktail = await sql`
      SELECT 
        c.id,
        c.nome,
        c.descrizione,
        c.prezzo,
        c.prezzo_tonica,
        c.nota,
        c.varianti,
        c.sezione,
        c.ordine
      FROM cocktail c
      WHERE c.disponibile = true
      ORDER BY 
        CASE c.sezione 
          WHEN 'Gin Premium' THEN 1 
          WHEN 'Gin Standard' THEN 2 
          WHEN 'Cocktail' THEN 3 
          ELSE 4 
        END,
        c.ordine
    `;

    const datiPuliti = cocktail;

    // Estrai le sezioni uniche mantenendo l'ordine
    const sezioni = [...new Set(datiPuliti.map((c: Record<string, unknown>) => c.sezione as string))];

    return NextResponse.json({
      cocktail: datiPuliti,
      sezioni: sezioni
    });

  } catch (err) {
    console.error('❌ Errore API /api/cocktails:', err);
    return NextResponse.json(
      { error: 'Impossibile caricare i cocktail. Riprova tra poco.' },
      { status: 500 }
    );
  }
}
