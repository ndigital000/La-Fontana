/**
 * =============================================================================
 * CONNESSIONE DATABASE — lib/db.ts
 * =============================================================================
 * Questo file crea e esporta la connessione al database Neon PostgreSQL.
 * 
 * COME FUNZIONA:
 * - Importa la funzione `neon` dal pacchetto @neondatabase/serverless
 * - Legge l'URL di connessione dalla variabile d'ambiente DATABASE_URL
 * - Valida che la variabile esista (errore chiaro se mancante)
 * - Esporta la funzione `sql` usata in tutte le API Route
 * 
 * PERCHÉ NEON SERVERLESS:
 * Neon usa HTTP per le query (non una connessione TCP persistente).
 * Questo è perfetto per le serverless functions di Vercel perché:
 * - Non c'è il problema del "connection pool exhaustion"
 * - Ogni richiesta apre e chiude una connessione HTTP rapidamente
 * - Funziona edge-compatible (anche nei Vercel Edge Functions)
 * 
 * PER MODIFICARE:
 * Se cambi database, aggiorna solo la variabile DATABASE_URL in .env.local
 * =============================================================================
 */

import { neon } from '@neondatabase/serverless';

// Validazione: se DATABASE_URL non è definita, il server crasha subito
// con un messaggio chiaro invece di un errore criptico più tardi
if (!process.env.DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL non trovata! Assicurati di avere un file .env.local con DATABASE_URL=postgresql://...'
  );
}

// Crea la funzione di query — si usa come tagged template literal:
// const risultati = await sql`SELECT * FROM piatti WHERE id = ${id}`;
const sql = neon(process.env.DATABASE_URL);

export default sql;
