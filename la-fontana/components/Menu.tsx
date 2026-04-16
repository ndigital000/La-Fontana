/**
 * =============================================================================
 * MENU — components/Menu.tsx
 * =============================================================================
 * Sezione del menu cibo. Funzionalità:
 * 
 * 1. FETCH DATI: Carica piatti e categorie dall'API /api/menu
 *    - useState per memorizzare i dati
 *    - useEffect per eseguire il fetch al montaggio del componente
 * 
 * 2. FILTRO PER CATEGORIA: Tab cliccabili (Panini, Carne, Aperitivo)
 *    derivati dinamicamente dai dati del database
 * 
 * 3. MODELLI 3D: Componente Model3D che renderizza file .glb con Three.js
 *    - Caricamento lazy (solo quando visibile nel viewport)
 *    - Rotazione continua del modello
 *    - Draco decoder per file compressi
 * 
 * 4. LOADING STATE: Skeleton animato durante il caricamento
 * 
 * 5. ERROR HANDLING: Se l'API fallisce, mostra i dati di fallback
 * 
 * 6. ANIMAZIONI: Framer Motion scroll reveal (whileInView)
 * 
 * PER MODIFICARE:
 * - Per aggiungere un piatto: INSERT nel database (tabella piatti)
 * - Per cambiare un prezzo: UPDATE piatti SET prezzo = X WHERE nome = '...'
 * - Per aggiungere un modello 3D: metti il file .glb in /public/models/
 *   e aggiorna il campo glb nel DB
 * =============================================================================
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// TIPI TYPESCRIPT
// Definiscono la "forma" dei dati — TypeScript ti avvisa se usi un campo sbagliato
// =============================================================================

/** Un piatto dal database */
interface Piatto {
  id: number;
  nome: string;
  descrizione: string;
  prezzo: string;       // numeric dal DB arriva come stringa
  orario: string | null;
  tag: string | null;
  glb: string | null;   // percorso al modello 3D, null se non c'è
  categoria: string;
}

// =============================================================================
// DATI DI FALLBACK
// Se il database è irraggiungibile, mostriamo questi dati statici
// così il sito non appare mai vuoto
// =============================================================================
const FALLBACK_PIATTI: Piatto[] = [
  { id: 1, categoria: 'Panini', nome: 'Hamburger La Fontana', descrizione: 'Hamburger, cheddar, cipolla caramellata, salsa BBQ, insalata fresca', prezzo: '10.00', orario: '18:00 – 00:00', tag: 'Best Seller', glb: '/models/hamburger3.glb' },
  { id: 2, categoria: 'Panini', nome: 'La Fontana ChickenBurger', descrizione: 'Cotoletta croccante, insalata, maionese, cipolla', prezzo: '9.00', orario: '18:00 – 00:00', tag: null, glb: '/models/chickenburger2.glb' },
  { id: 3, categoria: 'Carne', nome: 'Tagliata di Manzo', descrizione: '200g di tagliata con rucola e grana. Accompagnata da patatine fritte', prezzo: '16.00', orario: '18:00 – 23:00', tag: 'Include patatine', glb: '/models/tagliata.glb' },
  { id: 4, categoria: 'Aperitivo', nome: 'Tagliere Misto', descrizione: 'Selezione di salumi e formaggi, cipolle caramellate, fritti misti', prezzo: '14.00', orario: '18:00 – 21:00', tag: 'Aperitivo', glb: null },
];
const FALLBACK_CATEGORIE = ['Panini', 'Carne', 'Aperitivo'];

// =============================================================================
// COMPONENTE Model3D — Renderizza un modello 3D .glb con Three.js
// =============================================================================

// Flag globale: Three.js viene caricato una sola volta anche se ci sono più modelli
let threeLoaded = false;

/**
 * Carica le librerie Three.js, DRACOLoader e GLTFLoader da CDN.
 * Usa script tag iniettati nel DOM (non import ES6) perché queste
 * librerie sono pesanti e vogliamo caricarle solo quando servono.
 */
function loadThree(): Promise<void> {
  if (threeLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    // 1. Carica Three.js core
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s1.onload = () => {
      // 2. Carica DRACOLoader (decompressione modelli compressi)
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js';
      s2.onload = () => {
        // 3. Carica GLTFLoader (caricamento modelli .glb/.gltf)
        const s3 = document.createElement('script');
        s3.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
        s3.onload = () => { threeLoaded = true; resolve(); };
        document.head.appendChild(s3);
      };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  });
}

/**
 * Componente che renderizza un modello 3D in un canvas.
 * 
 * @param glbPath - Percorso al file .glb (es. "/models/hamburger3.glb")
 * 
 * COME FUNZIONA:
 * 1. Crea una scena Three.js con camera, luci e renderer
 * 2. Carica il modello .glb con GLTFLoader + Draco decoder
 * 3. Centra e scala il modello per farlo entrare nel canvas
 * 4. Lo fa ruotare continuamente con requestAnimationFrame
 * 5. Usa IntersectionObserver per pausare l'animazione quando non visibile
 */
function Model3D({ glbPath }: { glbPath: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let renderer: any;
    let isVisible = true;

    // IntersectionObserver: pausa l'animazione quando il modello esce dal viewport
    // Questo risparmia GPU, specialmente importante su mobile
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.1 } // 10% del canvas deve essere visibile
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    loadThree().then(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const THREE = (window as any).THREE;

      // === RENDERER ===
      // alpha: true = sfondo trasparente (il canvas non ha sfondo proprio)
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(140, 140);
      // Limita il pixel ratio a 1.5 su mobile per risparmiare GPU
      // Su desktop retina sarebbe 2, ma per un'anteprima 140px non serve
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputEncoding = THREE.sRGBEncoding;

      // === SCENA ===
      const scene = new THREE.Scene();

      // === CAMERA ===
      // PerspectiveCamera(angolo, proporzione, vicino, lontano)
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.5, 5); // Posizionata davanti e leggermente in alto
      camera.lookAt(0, 0, 0);         // Guarda verso il centro della scena

      // === LUCI ===
      // Luce ambientale: illumina tutto uniformemente (nessuna ombra)
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      // Luce direzionale: simula la luce del sole (crea ombre e riflessi)
      const luce = new THREE.DirectionalLight(0xfff5e0, 1.5);
      luce.position.set(3, 5, 4);
      scene.add(luce);

      // === GRUPPO ===
      // Il modello viene messo in un Group per poterlo ruotare attorno al centro
      const gruppo = new THREE.Group();
      scene.add(gruppo);

      // === DRACO DECODER ===
      // Draco è un algoritmo di compressione 3D di Google
      // Riduce la dimensione dei file .glb del 50-80%
      const draco = new THREE.DRACOLoader();
      draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

      // === GLTF LOADER ===
      // glTF è il formato standard per i modelli 3D web (come JPG per le foto)
      const loader = new THREE.GLTFLoader();
      loader.setDRACOLoader(draco);

      loader.load(glbPath, (gltf: any) => {
        const model = gltf.scene;
        // Calcola il bounding box per centrare e scalare il modello
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scala = 2.5 / maxDim; // Normalizza: qualsiasi modello avrà dimensione ~2.5

        model.position.sub(center);    // Centra il modello
        model.scale.setScalar(scala);  // Scala uniformemente
        gruppo.add(model);
      });

      // === LOOP DI ANIMAZIONE ===
      // requestAnimationFrame chiama questa funzione ~60 volte al secondo
      const anima = () => {
        animId = requestAnimationFrame(anima);
        // Se il canvas non è visibile, non renderizzare (risparmio GPU)
        if (!isVisible) return;
        gruppo.rotation.y += 0.014; // Rotazione lenta attorno all'asse Y
        renderer.render(scene, camera);
      };
      anima();
    });

    // === CLEANUP ===
    // Quando il componente si smonta (es. cambio categoria), libera le risorse
    return () => {
      cancelAnimationFrame(animId);
      renderer?.dispose();
      observer.disconnect();
    };
  }, [glbPath]);

  return (
    <div ref={containerRef} className="card-3d">
      <canvas ref={canvasRef} width={140} height={140} />
    </div>
  );
}

// =============================================================================
// COMPONENTE SKELETON — Placeholder durante il caricamento
// =============================================================================
function MenuSkeleton() {
  return (
    <div className="menu-list">
      {[1, 2, 3].map(i => (
        <div key={i} className="menu-card">
          <div className="skeleton" style={{ width: 140, height: 140, flexShrink: 0 }} />
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

// =============================================================================
// COMPONENTE PRINCIPALE — Menu
// =============================================================================
export default function Menu() {
  // Stato: lista dei piatti dal database
  const [piatti, setPiatti] = useState<Piatto[]>([]);
  // Stato: lista delle categorie per i tab
  const [categorie, setCategorie] = useState<string[]>([]);
  // Stato: categoria attualmente selezionata nel tab
  const [attiva, setAttiva] = useState('');
  // Stato: true durante il caricamento iniziale
  const [loading, setLoading] = useState(true);
  // Stato: messaggio di errore se il fetch fallisce
  const [errore, setErrore] = useState('');

  // === FETCH DATI AL MONTAGGIO ===
  useEffect(() => {
    async function caricaMenu() {
      try {
        // Chiama la nostra API Route
        const res = await fetch('/api/menu');

        // Se il server risponde con errore (es. 500), lancia un'eccezione
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Se la risposta contiene un errore dal backend
        if (data.error) throw new Error(data.error);

        // Salva i dati nello stato
        setPiatti(data.piatti);
        setCategorie(data.categorie);
        // Seleziona la prima categoria come default
        if (data.categorie.length > 0) setAttiva(data.categorie[0]);

      } catch (err) {
        // Se qualcosa va storto, usa i dati di fallback
        console.error('Errore caricamento menu:', err);
        setErrore('Menu caricato in modalità offline');
        setPiatti(FALLBACK_PIATTI);
        setCategorie(FALLBACK_CATEGORIE);
        setAttiva(FALLBACK_CATEGORIE[0]);
      } finally {
        // In ogni caso (successo o errore), nascondi lo skeleton
        setLoading(false);
      }
    }

    caricaMenu();
  }, []); // [] = esegui solo al primo render

  // Filtra i piatti per la categoria selezionata
  const filtrati = piatti.filter(p => p.categoria === attiva);

  // Varianti di animazione per Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 } // Ogni figlio appare 0.1s dopo il precedente
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="menu" className="menu-section">
      {/* ========= TITOLO SEZIONE ========= */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: '3rem' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">— Da mangiare —</p>
        <h2 className="section-title">
          Il <em>Menu</em>
        </h2>
      </motion.div>

      {/* ========= TAB CATEGORIE ========= */}
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
        {/* Link speciale: non filtra, ma scrolla alla sezione bevande */}
        <a href="#sez-bevande" className="tab-btn" style={{ textDecoration: 'none' }}>
          Birre &amp; Soft Drinks
        </a>
      </div>

      {/* ========= EVENTUALE AVVISO OFFLINE ========= */}
      {errore && (
        <p style={{ textAlign: 'center', color: 'var(--gold-dim)', fontSize: '0.72rem', marginBottom: '1rem' }}>
          ⚠ {errore}
        </p>
      )}

      {/* ========= LISTA PIATTI (o skeleton durante il loading) ========= */}
      {loading ? (
        <MenuSkeleton />
      ) : (
        <motion.div
          className="menu-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {filtrati.map(piatto => (
            <motion.div
              key={piatto.id}
              className="menu-card"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Modello 3D o placeholder emoji */}
              {piatto.glb ? (
                <Model3D glbPath={piatto.glb} />
              ) : (
                <div className="card-placeholder">🍽️</div>
              )}

              {/* Informazioni del piatto */}
              <div className="card-info">
                <div className="card-header">
                  <h3 className="card-name">{piatto.nome}</h3>
                  <span className="card-price">€{parseFloat(piatto.prezzo).toFixed(0)}</span>
                </div>
                <p className="card-desc">{piatto.descrizione}</p>
                <div className="card-meta">
                  {piatto.tag && <span className="badge">{piatto.tag}</span>}
                  {piatto.orario && <span className="card-orario">🕐 {piatto.orario}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}