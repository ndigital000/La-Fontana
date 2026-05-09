/**
 * =============================================================================
 * BEVANDE — components/Bevande.tsx
 * =============================================================================
 * Sezione "Birre & Soft Drinks". Funzionalità:
 * 
 * 1. FETCH DATI: Carica bevande dall'API /api/bevande
 * 2. LOADING STATE: Skeleton animato durante il caricamento
 * 3. ERROR HANDLING: Fallback su dati statici se il DB non risponde
 * 4. ANIMAZIONI: Scroll reveal con Framer Motion
 * 
 * PER MODIFICARE:
 * - Aggiungere una birra: INSERT INTO bevande (nome, prezzo, nota, ordine) VALUES (...)
 * - Cambiare prezzo: UPDATE bevande SET prezzo = X WHERE nome = '...'
 * - L'ID della sezione è "sez-bevande" — usato dai link nella Navbar e Hero
 * =============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Tipo TypeScript per una bevanda

interface Bevanda {
  id: number;
  nome: string;
  prezzo: string;
  nota: string | null;
  categorie_cocktail: string;
}

// Dati di fallback se il database non risponde
const FALLBACK: Bevanda[] = [
  { id: 1, nome: 'Nastro Azzurro',     prezzo: '4.00', nota: '33cl',                       categorie_cocktail: 'Birre' },
  { id: 2, nome: 'Heineken',           prezzo: '4.00', nota: '33cl',                       categorie_cocktail: 'Birre' },
  { id: 3, nome: 'Bud',               prezzo: '4.00', nota: '33cl',                       categorie_cocktail: 'Birre' },
  { id: 4, nome: 'Bjorne / Ceres',    prezzo: '5.00', nota: '33cl',                       categorie_cocktail: 'Birre' },
  { id: 5, nome: 'Bibite analcoliche', prezzo: '3.00', nota: 'Coca Cola · Fanta · Sprite', categorie_cocktail: 'Analcoliche' },
  { id: 6, nome: 'Acqua Minerale',    prezzo: '2.00', nota: '50cl',                       categorie_cocktail: 'Analcoliche' },
  { id: 7, nome: 'Amaro del Capo',    prezzo: '4.00', nota: null,                         categorie_cocktail: 'Amari' },
  { id: 8, nome: 'Jägermeister',      prezzo: '4.00', nota: null,                         categorie_cocktail: 'Amari' },
  { id: 9, nome: 'Brancamenta',       prezzo: '4.00', nota: null,                         categorie_cocktail: 'Amari' },
  { id:10, nome: 'Amaro di Strongoli',prezzo: '4.00', nota: null,                         categorie_cocktail: 'Amari' },
  { id:11, nome: 'Fernet Branca',     prezzo: '4.00', nota: null,                         categorie_cocktail: 'Amari' },
];
const CATEGORIE = ['Birre', 'Analcoliche', 'Amari'];

// Skeleton loader durante il caricamento
function BevandeSkeleton() {
  return (
    <div className="bevande-list">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bevanda-card">
          <div>
            <div className="skeleton skeleton-text" style={{ width: '50%' }} />
            <div className="skeleton skeleton-text" style={{ width: '30%', height: '0.6rem' }} />
          </div>
          <div className="skeleton" style={{ width: '40px', height: '1rem' }} />
        </div>
      ))}
    </div>
  );
}

export default function Bevande() {
  const [bevande,  setBevande]  = useState<Bevanda[]>([]);
  const [attiva,   setAttiva]   = useState('Birre');
  const [loading,  setLoading]  = useState(true);
  const [errore,   setErrore]   = useState('');

  useEffect(() => {
    async function caricaBevande() {
      try {
        const res = await fetch('/api/bevande');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setBevande(data.bevande);
      } catch (err) {
        console.error('Errore caricamento bevande:', err);
        setErrore('Bevande caricate in modalità offline');
        setBevande(FALLBACK);
      } finally {
        setLoading(false);
      }
    }
    caricaBevande();
  }, []);

  const filtrate = bevande.filter(b => b.categorie_cocktail === attiva);

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="sez-bevande" className="bevande-section">

      {/* TITOLO */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">— Per rinfrescarsi —</p>
        <h2 className="section-title">
          Birre & <em>Soft Drinks</em>
        </h2>
        <div className="divider" />
      </motion.div>

      {/* TAB CATEGORIE */}
      <div className="menu-tabs">
        {CATEGORIE.map(cat => (
          <button
            key={cat}
            onClick={() => setAttiva(cat)}
            className={`tab-btn ${attiva === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* AVVISO OFFLINE */}
      {errore && (
        <p style={{ textAlign: 'center', color: 'var(--gold-dim)', fontSize: '0.72rem', marginBottom: '1rem' }}>
          ⚠ {errore}
        </p>
      )}

      {/* LISTA */}
      {loading ? (
        <BevandeSkeleton />
      ) : (
        <motion.div
          key={attiva}
          className="bevande-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {filtrate.map(b => (
            <motion.div
              key={b.id}
              className="bevanda-card"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div>
                <div className="bevanda-name">{b.nome}</div>
                {b.nota && <div className="bevanda-nota">{b.nota}</div>}
              </div>
              <span className="bevanda-price">€{parseFloat(b.prezzo).toFixed(0)}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="section-divider" />

    </section>
  );
}
