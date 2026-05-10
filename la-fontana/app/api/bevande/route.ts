import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sanitizeRows } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bevande = await sql`
      SELECT id, nome, prezzo, nota, ordine, categorie_cocktail
      FROM bevande
      WHERE disponibile = true
      ORDER BY
        CASE categorie_cocktail
          WHEN 'Birre'       THEN 1
          WHEN 'Analcoliche' THEN 2
          WHEN 'Amari'       THEN 3
          ELSE 4
        END,
        ordine
    `;

    const datiPuliti = sanitizeRows(bevande);

    return NextResponse.json({ bevande: datiPuliti });

  } catch (err) {
    console.error('Errore API /api/bevande:', err);
    return NextResponse.json(
      { error: 'Impossibile caricare le bevande. Riprova tra poco.' },
      { status: 500 }
    );
  }
}
