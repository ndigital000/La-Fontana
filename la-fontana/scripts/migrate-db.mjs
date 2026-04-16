/**
 * =============================================================================
 * SCRIPT DI MIGRAZIONE DATABASE — La Fontana
 * =============================================================================
 * Questo script modifica lo schema del database Neon PostgreSQL:
 * 1. Aggiunge colonne mancanti alla tabella `piatti` (orario, tag, glb)
 * 2. Aggiunge colonne alla tabella `cocktail` (prezzo_tonica, nota, varianti, sezione)
 * 3. Crea la nuova tabella `bevande`
 * 
 * ESEGUIRE UNA SOLA VOLTA con: node scripts/migrate-db.mjs
 * =============================================================================
 */

import { neon } from '@neondatabase/serverless';

// Connessione al database usando la stessa URL del progetto
const sql = neon('postgresql://neondb_owner:npg_rq2mfxcjuy9A@ep-morning-hall-ab2wf08r.eu-west-2.aws.neon.tech/neondb?sslmode=require');

async function migrate() {
  console.log('🔄 Inizio migrazione database...\n');

  try {
    // =========================================================================
    // STEP 1: Aggiungere colonne alla tabella `piatti`
    // =========================================================================
    console.log('📦 Step 1: ALTER TABLE piatti...');
    
    // "orario" — indica la fascia oraria in cui il piatto è disponibile
    await sql`ALTER TABLE piatti ADD COLUMN IF NOT EXISTS orario VARCHAR(50)`;
    
    // "tag" — etichetta speciale (es. "Best Seller", "Aperitivo", "Include patatine")
    await sql`ALTER TABLE piatti ADD COLUMN IF NOT EXISTS tag VARCHAR(100)`;
    
    // "glb" — percorso al file del modello 3D (.glb) nella cartella /public/models/
    await sql`ALTER TABLE piatti ADD COLUMN IF NOT EXISTS glb VARCHAR(255)`;
    
    console.log('   ✅ Colonne orario, tag, glb aggiunte a piatti\n');

    // =========================================================================
    // STEP 2: Aggiungere colonne alla tabella `cocktail`
    // =========================================================================
    console.log('🍸 Step 2: ALTER TABLE cocktail...');
    
    // "prezzo_tonica" — prezzo quando servito con acqua tonica (per i gin)
    await sql`ALTER TABLE cocktail ADD COLUMN IF NOT EXISTS prezzo_tonica NUMERIC(6,2)`;
    
    // "nota" — informazione aggiuntiva (es. "Fever Tree", "Lemon Soda / Schweppes")
    await sql`ALTER TABLE cocktail ADD COLUMN IF NOT EXISTS nota VARCHAR(255)`;
    
    // "varianti" — le opzioni disponibili (es. "Lemon · Tonica", "Classico · Sbagliato")
    await sql`ALTER TABLE cocktail ADD COLUMN IF NOT EXISTS varianti VARCHAR(255)`;
    
    // "sezione" — categoria di visualizzazione: "Gin Premium", "Gin Standard", "Cocktail"
    await sql`ALTER TABLE cocktail ADD COLUMN IF NOT EXISTS sezione VARCHAR(50)`;
    
    console.log('   ✅ Colonne prezzo_tonica, nota, varianti, sezione aggiunte a cocktail\n');

    // =========================================================================
    // STEP 3: Creare la tabella `bevande`
    // =========================================================================
    console.log('🍺 Step 3: CREATE TABLE bevande...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS bevande (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        prezzo NUMERIC(6,2) NOT NULL,
        nota VARCHAR(255),
        ordine INTEGER DEFAULT 0,
        disponibile BOOLEAN DEFAULT true
      )
    `;
    
    console.log('   ✅ Tabella bevande creata\n');

    // =========================================================================
    // STEP 4: Aggiornare le categorie cocktail
    // =========================================================================
    console.log('📂 Step 4: Aggiornamento categorie_cocktail...');
    
    // Svuota e reinserisci le categorie per adattarle alla nuova struttura
    await sql`DELETE FROM categorie_cocktail`;
    await sql`INSERT INTO categorie_cocktail (id, nome, descrizione, ordine) VALUES 
      (1, 'Gin Premium', 'Gin selezionati con acqua tonica Fever Tree', 1),
      (2, 'Gin Standard', 'Gin classici con Lemon Soda o Schweppes', 2),
      (3, 'Cocktail', 'Cocktail classici e signature', 3)
    `;
    // Reset della sequenza ID per evitare conflitti futuri
    await sql`SELECT setval('categorie_cocktail_id_seq', 3)`;
    
    console.log('   ✅ Categorie cocktail aggiornate\n');

    console.log('🎉 Migrazione completata con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
    process.exit(1);
  }
}

migrate();
