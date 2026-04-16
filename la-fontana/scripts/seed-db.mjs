/**
 * =============================================================================
 * SCRIPT DI SEEDING DATABASE — La Fontana
 * =============================================================================
 * Popola il database con i dati attualmente hardcoded nei componenti.
 * Aggiorna i record esistenti (piatti e cocktail) con i nuovi campi,
 * e inserisce i dati nella nuova tabella bevande.
 *
 * ESEGUIRE DOPO migrate-db.mjs: node scripts/seed-db.mjs
 * =============================================================================
 */

import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_rq2mfxcjuy9A@ep-morning-hall-ab2wf08r.eu-west-2.aws.neon.tech/neondb?sslmode=require');

async function seed() {
  console.log('🌱 Inizio seeding database...\n');

  try {
    // =========================================================================
    // STEP 1: Aggiornare i piatti esistenti con orario, tag e glb
    // =========================================================================
    console.log('🍔 Step 1: Aggiornamento piatti...');

    // Hamburger La Fontana (id=1) — Best Seller, ha modello 3D
    await sql`UPDATE piatti SET orario = '18:00 – 00:00', tag = 'Best Seller', glb = '/models/hamburger3.glb' WHERE id = 1`;

    // ChickenBurger (id=2) — nessun tag, ha modello 3D
    await sql`UPDATE piatti SET orario = '18:00 – 00:00', tag = NULL, glb = '/models/chickenburger2.glb' WHERE id = 2`;

    // Tagliata di Manzo (id=3) — include patatine, ha modello 3D
    await sql`UPDATE piatti SET orario = '18:00 – 23:00', tag = 'Include patatine', glb = '/models/tagliata.glb' WHERE id = 3`;

    // Tagliere Misto (id=4) — aperitivo, nessun modello 3D
    await sql`UPDATE piatti SET orario = '18:00 – 21:00', tag = 'Aperitivo', glb = NULL WHERE id = 4`;

    console.log('   ✅ 4 piatti aggiornati\n');

    // =========================================================================
    // STEP 2: Aggiornare i cocktail con sezione, varianti, nota, prezzo_tonica
    // =========================================================================
    console.log('🍸 Step 2: Aggiornamento cocktail...');

    // Gin Premium (id 1-6) — tutti a €9, con Fever Tree
    const ginPremium = [
      { id: 1, nome: 'Gin Mare' },
      { id: 2, nome: 'Malfy' },
      { id: 3, nome: 'Portofino' },
      { id: 4, nome: 'Hendricks' },
      { id: 5, nome: 'Nordes' },
    ];

    for (const gin of ginPremium) {
      await sql`UPDATE cocktail SET 
        sezione = 'Gin Premium', 
        varianti = 'Lemon · Tonica', 
        prezzo_tonica = 9, 
        nota = 'Fever Tree',
        categoria_id = 1
        WHERE id = ${gin.id}`;
    }

    // Controlliamo se Engine (id=6) esiste, se no lo aggiungiamo
    const engine = await sql`SELECT id FROM cocktail WHERE id = 6`;
    if (engine.length === 0) {
      await sql`INSERT INTO cocktail (id, categoria_id, nome, descrizione, prezzo, disponibile, ordine, sezione, varianti, prezzo_tonica, nota) 
        VALUES (6, 1, 'Engine', 'Lemon · Tonica — Fever Tree', 9, true, 6, 'Gin Premium', 'Lemon · Tonica', 9, 'Fever Tree')`;
    } else {
      await sql`UPDATE cocktail SET 
        sezione = 'Gin Premium', varianti = 'Lemon · Tonica', prezzo_tonica = 9, nota = 'Fever Tree', categoria_id = 1
        WHERE id = 6`;
    }

    // Gin Standard (id 7-9)
    // Tanqueray
    const tanqueray = await sql`SELECT id FROM cocktail WHERE id = 7`;
    if (tanqueray.length === 0) {
      await sql`INSERT INTO cocktail (id, categoria_id, nome, descrizione, prezzo, disponibile, ordine, sezione, varianti, prezzo_tonica, nota)
        VALUES (7, 2, 'Tanqueray', 'Lemon · Tonica — Lemon Soda / Schweppes', 7, true, 1, 'Gin Standard', 'Lemon · Tonica', 7, 'Lemon Soda / Schweppes')`;
    } else {
      await sql`UPDATE cocktail SET 
        sezione = 'Gin Standard', varianti = 'Lemon · Tonica', prezzo_tonica = 7, nota = 'Lemon Soda / Schweppes', categoria_id = 2
        WHERE id = 7`;
    }

    // Bombay
    const bombay = await sql`SELECT id FROM cocktail WHERE id = 8`;
    if (bombay.length === 0) {
      await sql`INSERT INTO cocktail (id, categoria_id, nome, descrizione, prezzo, disponibile, ordine, sezione, varianti, prezzo_tonica, nota)
        VALUES (8, 2, 'Bombay', 'Lemon · Tonica — Lemon Soda / Schweppes', 7, true, 2, 'Gin Standard', 'Lemon · Tonica', 7, 'Lemon Soda / Schweppes')`;
    } else {
      await sql`UPDATE cocktail SET 
        sezione = 'Gin Standard', varianti = 'Lemon · Tonica', prezzo_tonica = 7, nota = 'Lemon Soda / Schweppes', categoria_id = 2
        WHERE id = 8`;
    }

    // Gordon's
    const gordons = await sql`SELECT id FROM cocktail WHERE id = 9`;
    if (gordons.length === 0) {
      await sql`INSERT INTO cocktail (id, categoria_id, nome, descrizione, prezzo, disponibile, ordine, sezione, varianti, prezzo_tonica, nota)
        VALUES (9, 2, 'Gordon''s', 'Lemon · Tonica — Lemon Soda / Schweppes', 6, true, 3, 'Gin Standard', 'Lemon · Tonica', 6, 'Lemon Soda / Schweppes')`;
    } else {
      await sql`UPDATE cocktail SET 
        sezione = 'Gin Standard', varianti = 'Lemon · Tonica', prezzo_tonica = 6, nota = 'Lemon Soda / Schweppes', categoria_id = 2
        WHERE id = 9`;
    }

    // Cocktail classici (id 10-12)
    const negroni = await sql`SELECT id FROM cocktail WHERE id = 10`;
    if (negroni.length === 0) {
      await sql`INSERT INTO cocktail (id, categoria_id, nome, descrizione, prezzo, disponibile, ordine, sezione, varianti, prezzo_tonica, nota)
        VALUES (10, 3, 'Negroni', 'Classico · Sbagliato', 8, true, 1, 'Cocktail', 'Classico · Sbagliato', 7, NULL)`;
    } else {
      await sql`UPDATE cocktail SET 
        sezione = 'Cocktail', varianti = 'Classico · Sbagliato', prezzo_tonica = 7, nota = NULL, categoria_id = 3
        WHERE id = 10`;
    }

    const tris = await sql`SELECT id FROM cocktail WHERE id = 11`;
    if (tris.length === 0) {
      await sql`INSERT INTO cocktail (id, categoria_id, nome, descrizione, prezzo, disponibile, ordine, sezione, varianti, prezzo_tonica, nota)
        VALUES (11, 3, 'Tris Vodka & Red Bull', NULL, 10, true, 2, 'Cocktail', NULL, NULL, NULL)`;
    } else {
      await sql`UPDATE cocktail SET 
        sezione = 'Cocktail', varianti = NULL, prezzo_tonica = NULL, nota = NULL, categoria_id = 3
        WHERE id = 11`;
    }

    const vodkaLemon = await sql`SELECT id FROM cocktail WHERE id = 12`;
    if (vodkaLemon.length === 0) {
      await sql`INSERT INTO cocktail (id, categoria_id, nome, descrizione, prezzo, disponibile, ordine, sezione, varianti, prezzo_tonica, nota)
        VALUES (12, 3, 'Vodka Lemon', NULL, 7, true, 3, 'Cocktail', NULL, NULL, NULL)`;
    } else {
      await sql`UPDATE cocktail SET 
        sezione = 'Cocktail', varianti = NULL, prezzo_tonica = NULL, nota = NULL, categoria_id = 3
        WHERE id = 12`;
    }

    // Reset sequenza cocktail
    await sql`SELECT setval('cocktail_id_seq', (SELECT MAX(id) FROM cocktail))`;

    console.log('   ✅ 12 cocktail aggiornati/inseriti\n');

    // =========================================================================
    // STEP 3: Inserire bevande
    // =========================================================================
    console.log('🍺 Step 3: Inserimento bevande...');

    // Svuota e reinserisci per sicurezza (tabella appena creata)
    await sql`DELETE FROM bevande`;

    await sql`INSERT INTO bevande (nome, prezzo, nota, ordine) VALUES
      ('Nastro Azzurro', 4, '33cl', 1),
      ('Heineken', 4, '33cl', 2),
      ('Bud', 4, '33cl', 3),
      ('Bjorne / Ceres', 5, '33cl', 4),
      ('Bibite analcoliche', 3, 'Coca Cola · Fanta · Sprite', 5),
      ('Acqua Minerale', 2, '50cl', 6)
    `;

    console.log('   ✅ 6 bevande inserite\n');

    console.log('🎉 Seeding completato con successo!');

  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
    process.exit(1);
  }
}

seed();
