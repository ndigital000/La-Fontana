/**
 * =============================================================================
 * COCKTAIL — components/Cocktail.tsx
 * =============================================================================
 * Sezione cocktail e gin. Funzionalità:
 * 
 * 1. FETCH DATI: Carica cocktail dall'API /api/cocktails
 * 
 * 2. TRE SEZIONI FILTRABILI:
 *    - Gin Premium: mostra la scelta Gin Lemon / Gin Tonica con "Fever Tree"
 *    - Gin Standard: come premium ma con "Lemon Soda / Schweppes"
 *    - Cocktail: lista classica con prezzo singolo
 * 
 * 3. LOGICA GIN PREMIUM (IMPORTANTE):
 *    Per ogni gin premium/standard, il cliente può scegliere tra:
 *    - "Gin Lemon" → gin + lemon (Fever Tree per premium, Lemon Soda per standard)
 *    - "Gin Tonica" → gin + acqua tonica (Fever Tree per premium, Schweppes per standard)
 *    Entrambe le opzioni hanno il PROPRIO prezzo e sono visualizzate side-by-side
 * 
 * PER MODIFICARE:
 * - Per aggiungere un gin: INSERT nella tabella cocktail con sezione = 'Gin Premium'
 * - Per cambiare il prezzo tonica: UPDATE cocktail SET prezzo_tonica = X WHERE nome = '...'
 * - Per cambiare la marca della tonica: UPDATE cocktail SET nota = '...' WHERE id = X
 * =============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// TIPI TYPESCRIPT
// =============================================================================

interface CocktailItem {
  id: number;
  nome: string;
  descrizione: string | null;
  prezzo: string;          // Prezzo base (per gin = prezzo lemon)
  prezzo_tonica: string | null;  // Prezzo con tonica (solo per gin)
  nota: string | null;     // "Fever Tree" o "Lemon Soda / Schweppes"
  varianti: string | null; // "Lemon · Tonica" o "Classico · Sbagliato"
  sezione: string;         // "Gin Premium", "Gin Standard", "Cocktail"
}

// =============================================================================
// DATI DI FALLBACK (usati se il database è offline)
// =============================================================================
const FALLBACK: CocktailItem[] = [
  { id: 1, sezione: 'Gin Premium', nome: 'Gin Mare', descrizione: null, prezzo: '9.00', prezzo_tonica: '9.00', nota: 'Fever Tree', varianti: 'Lemon · Tonica' },
  { id: 2, sezione: 'Gin Premium', nome: 'Malfy', descrizione: null, prezzo: '9.00', prezzo_tonica: '9.00', nota: 'Fever Tree', varianti: 'Lemon · Tonica' },
  { id: 3, sezione: 'Gin Premium', nome: 'Portofino', descrizione: null, prezzo: '9.00', prezzo_tonica: '9.00', nota: 'Fever Tree', varianti: 'Lemon · Tonica' },
  { id: 4, sezione: 'Gin Premium', nome: 'Hendricks', descrizione: null, prezzo: '9.00', prezzo_tonica: '9.00', nota: 'Fever Tree', varianti: 'Lemon · Tonica' },
  { id: 5, sezione: 'Gin Premium', nome: 'Nordes', descrizione: null, prezzo: '9.00', prezzo_tonica: '9.00', nota: 'Fever Tree', varianti: 'Lemon · Tonica' },
  { id: 6, sezione: 'Gin Premium', nome: 'Engine', descrizione: null, prezzo: '9.00', prezzo_tonica: '9.00', nota: 'Fever Tree', varianti: 'Lemon · Tonica' },
  { id: 7, sezione: 'Gin Standard', nome: 'Tanqueray', descrizione: null, prezzo: '7.00', prezzo_tonica: '7.00', nota: 'Lemon Soda / Schweppes', varianti: 'Lemon · Tonica' },
  { id: 8, sezione: 'Gin Standard', nome: 'Bombay', descrizione: null, prezzo: '7.00', prezzo_tonica: '7.00', nota: 'Lemon Soda / Schweppes', varianti: 'Lemon · Tonica' },
  { id: 9, sezione: 'Gin Standard', nome: "Gordon's", descrizione: null, prezzo: '6.00', prezzo_tonica: '6.00', nota: 'Lemon Soda / Schweppes', varianti: 'Lemon · Tonica' },
  { id: 10, sezione: 'Cocktail', nome: 'Negroni', descrizione: null, prezzo: '8.00', prezzo_tonica: '7.00', nota: null, varianti: 'Classico · Sbagliato' },
  { id: 11, sezione: 'Cocktail', nome: 'Tris Vodka & Red Bull', descrizione: null, prezzo: '10.00', prezzo_tonica: null, nota: null, varianti: null },
  { id: 12, sezione: 'Cocktail', nome: 'Vodka Lemon', descrizione: null, prezzo: '7.00', prezzo_tonica: null, nota: null, varianti: null },
];
const FALLBACK_SEZIONI = ['Gin Premium', 'Gin Standard', 'Cocktail'];

// =============================================================================
// SKELETON LOADER
// =============================================================================
function CocktailSkeleton() {
  return (
    <div className="cocktail-list">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="cocktail-card">
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
          <div className="skeleton skeleton-text" style={{ width: '15%' }} />
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPALE — Cocktail
// =============================================================================
export default function Cocktail() {
  const [cocktails, setCocktails] = useState<CocktailItem[]>([]);
  const [sezioni, setSezioni] = useState<string[]>([]);
  const [attiva, setAttiva] = useState('');
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState('');

  // === FETCH DATI ===
  useEffect(() => {
    async function caricaCocktail() {
      try {
        const res = await fetch('/api/cocktails');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setCocktails(data.cocktail);
        setSezioni(data.sezioni);
        if (data.sezioni.length > 0) setAttiva(data.sezioni[0]);
      } catch (err) {
        console.error('Errore caricamento cocktail:', err);
        setErrore('Cocktail caricati in modalità offline');
        setCocktails(FALLBACK);
        setSezioni(FALLBACK_SEZIONI);
        setAttiva(FALLBACK_SEZIONI[0]);
      } finally {
        setLoading(false);
      }
    }
    caricaCocktail();
  }, []);

  // Filtra per la sezione attiva
  const filtrati = cocktails.filter(c => c.sezione === attiva);

  // Determina se la sezione attiva è una sezione "gin" (ha opzioni Lemon/Tonica)
  const isGinSection = attiva.toLowerCase().includes('gin');

  // Varianti animazione
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="cocktail" className="cocktail-section">
      {/* ========= TITOLO ========= */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: '3rem' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">— Da bere —</p>
        <h2 className="section-title">
          I Nostri <em>Cocktail</em>
        </h2>
      </motion.div>

      {/* ========= TAB SEZIONI ========= */}
      <div className="menu-tabs">
        {sezioni.map(s => (
          <button
            key={s}
            onClick={() => setAttiva(s)}
            className={`tab-btn ${attiva === s ? 'active' : ''}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========= AVVISO OFFLINE ========= */}
      {errore && (
        <p style={{ textAlign: 'center', color: 'var(--gold-dim)', fontSize: '0.72rem', marginBottom: '1rem' }}>
          ⚠ {errore}
        </p>
      )}

      {/* ========= NOTA TONICA (solo per sezioni gin) ========= */}
      {isGinSection && filtrati.length > 0 && filtrati[0].nota && (
        <motion.p
          style={{
            textAlign: 'center',
            color: 'var(--gold)',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🍋 Serviti con {filtrati[0].nota}
        </motion.p>
      )}

      {/* ========= LISTA ========= */}
      {loading ? (
        <CocktailSkeleton />
      ) : (
        <motion.div
          className="cocktail-list"
          key={attiva} // Forza il re-render quando cambia sezione
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtrati.map(voce => (
            <motion.div
              key={voce.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              {/* ===== CARD GIN (con opzioni Lemon/Tonica) ===== */}
              {isGinSection ? (
                <div className="gin-card">
                  <div className="gin-header">
                    <span className="gin-name">{voce.nome}</span>
                    {voce.nota && <span className="gin-nota">{voce.nota}</span>}
                  </div>
                  <div className="gin-options">
                    {/* Opzione 1: Gin Lemon */}
                    <div className="gin-option">
                      <span className="gin-option-label">🍋 Lemon</span>
                      <span className="gin-option-price">€{parseFloat(voce.prezzo).toFixed(0)}</span>
                    </div>
                    {/* Opzione 2: Gin Tonica */}
                    {voce.prezzo_tonica && (
                      <div className="gin-option">
                        <span className="gin-option-label">🥂 Tonica</span>
                        <span className="gin-option-price">€{parseFloat(voce.prezzo_tonica).toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ===== CARD COCKTAIL CLASSICO (prezzo singolo) ===== */
                <div className="cocktail-card">
                  <div>
                    <div className="cocktail-name">{voce.nome}</div>
                    {voce.varianti && (
                      <div className="cocktail-varianti">{voce.varianti}</div>
                    )}
                  </div>
                  <span className="cocktail-price">€{parseFloat(voce.prezzo).toFixed(0)}</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}