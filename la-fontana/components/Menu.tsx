/**
 * =============================================================================
 * MENU — components/Menu.tsx
 * =============================================================================
 * Sezione del menu cibo. Funzionalità:
 *
 * 1. FETCH DATI: Carica piatti e categorie dall'API /api/menu
 * 2. FILTRO PER CATEGORIA: Tab cliccabili derivati dal database
 * 3. FOTO: Immagine del piatto (placeholder Unsplash → sostituire con foto reali)
 * 4. LOADING STATE: Skeleton animato durante il caricamento
 * 5. ERROR HANDLING: Dati di fallback se l'API non risponde
 * 6. ANIMAZIONI: Framer Motion scroll reveal (whileInView)
 *
 * PER SOSTITUIRE LE FOTO CON LE TUE:
 * 1. Metti le foto in /public/images/ (es. hamburger.jpg)
 * 2. Nel database aggiorna il campo "glb" con il nuovo percorso: /images/hamburger.jpg
 *    (il campo si chiama ancora "glb" nel DB ma ora contiene il path della foto)
 * 3. Oppure aggiorna direttamente FALLBACK_PIATTI qui sotto
 *
 * PER MODIFICARE PREZZI/PIATTI:
 * - Aggiorna nel database (tabella piatti) — il sito si aggiorna da solo
 * =============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Piatto {
  id: number;
  nome: string;
  descrizione: string;
  prezzo: string;
  orario: string | null;
  tag: string | null;
  glb: string | null;
  categoria: string;
}

const FOTO_PLACEHOLDER: Record<string, string> = {
  'Panini':    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Carne':     'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  'Aperitivo': 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&q=80',
};
const FOTO_DEFAULT = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';

function getFoto(piatto: Piatto): string {
  if (piatto.glb && piatto.glb.startsWith('/') && !piatto.glb.endsWith('.glb'))
    return piatto.glb;
  return FOTO_PLACEHOLDER[piatto.categoria] ?? FOTO_DEFAULT;
}

const FALLBACK_PIATTI: Piatto[] = [
  { id: 1, categoria: 'Panini',    nome: 'Hamburger La Fontana',     descrizione: 'Hamburger, cheddar, cipolla caramellata, salsa BBQ, insalata fresca', prezzo: '10.00', orario: '18:00 – 00:00', tag: 'Best Seller', glb: null },
  { id: 2, categoria: 'Panini',    nome: 'La Fontana ChickenBurger', descrizione: 'Cotoletta croccante, insalata, maionese, cipolla',                     prezzo: '9.00',  orario: '18:00 – 00:00', tag: null,          glb: null },
  { id: 3, categoria: 'Carne',     nome: 'Tagliata di Manzo',        descrizione: '200g di tagliata con rucola e grana, con patatine fritte',             prezzo: '16.00', orario: '18:00 – 23:00', tag: 'Include patatine', glb: null },
  { id: 4, categoria: 'Aperitivo', nome: 'Tagliere Misto',           descrizione: 'Selezione di salumi e formaggi, cipolle caramellate, fritti misti',    prezzo: '14.00', orario: '18:00 – 21:00', tag: 'Aperitivo',   glb: null },
];
const FALLBACK_CATEGORIE = ['Panini', 'Carne', 'Aperitivo'];

function PiattoCard({ piatto, variants }: { piatto: Piatto; variants: any }) {
  const foto = getFoto(piatto);

  return (
    <motion.div
      className="menu-card"
      variants={variants}
      whileHover={{ backgroundColor: 'var(--dark-4)' }}
      transition={{ duration: 0.2 }}
    >
      <div style={{
        flexShrink: 0,
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Image
          src={foto}
          alt={piatto.nome}
          fill
          sizes="100px"
          style={{ objectFit: 'cover' }}
          unoptimized={foto.startsWith('https://')}
        />
      </div>

      <div className="card-info">
        <div className="card-header">
          <h3 className="card-name">{piatto.nome}</h3>
          <span className="card-price">€{parseFloat(piatto.prezzo).toFixed(0)}</span>
        </div>
        <p className="card-desc">{piatto.descrizione}</p>
        <div className="card-meta">
          {piatto.tag    && <span className="badge">{piatto.tag}</span>}
          {piatto.orario && <span className="card-orario">🕐 {piatto.orario}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function MenuSkeleton() {
  return (
    <div className="menu-list">
      {[1, 2, 3].map(i => (
        <div key={i} className="menu-card">
          <div className="skeleton" style={{ width: 100, height: 100, flexShrink: 0, borderRadius: 8 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text medium" />
            <div className="skeleton skeleton-text short" />
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '0.7rem' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
  const [piatti,    setPiatti]    = useState<Piatto[]>([]);
  const [categorie, setCategorie] = useState<string[]>([]);
  const [attiva,    setAttiva]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [errore,    setErrore]    = useState('');

  useEffect(() => {
    async function caricaMenu() {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPiatti(data.piatti);
        setCategorie(data.categorie);
        if (data.categorie.length > 0) setAttiva(data.categorie[0]);
      } catch (err) {
        console.error('Errore caricamento menu:', err);
        setErrore('Menu caricato in modalità offline');
        setPiatti(FALLBACK_PIATTI);
        setCategorie(FALLBACK_CATEGORIE);
        setAttiva(FALLBACK_CATEGORIE[0]);
      } finally {
        setLoading(false);
      }
    }
    caricaMenu();
  }, []);

  const filtrati = piatti.filter(p => p.categoria === attiva);

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="menu" className="menu-section">

      <motion.div
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">— Da mangiare —</p>
        <h2 className="section-title">Il <em>Menu</em></h2>
      </motion.div>

      <div className="menu-tabs">
        {categorie.map(cat => (
          <button
            key={cat}
            onClick={() => setAttiva(cat)}
            className={`tab-btn ${attiva === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
        <a href="#sez-bevande" className="tab-btn">
          Birre & Soft Drinks
        </a>
      </div>

      {errore && (
        <p style={{ textAlign: 'center', color: 'var(--gold-dim)', fontSize: '0.72rem', marginBottom: '1rem' }}>
          ⚠ {errore}
        </p>
      )}

      {loading ? (
        <MenuSkeleton />
      ) : (
        <motion.div
          key={attiva}
          className="menu-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {filtrati.map(piatto => (
            <PiattoCard key={piatto.id} piatto={piatto} variants={itemVariants} />
          ))}
        </motion.div>
      )}

      <div className="section-divider" />

    </section>
  );
}

