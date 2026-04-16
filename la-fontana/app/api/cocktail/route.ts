import { NextResponse } from 'next/server';
import sql from '@/lib/db';

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
    return NextResponse.json(cocktail);
  } catch (err) {
    console.error('Errore API cocktail:', err);
    return NextResponse.json({ error: 'Errore database' }, { status: 500 });
  }
}