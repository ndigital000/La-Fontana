# README_PROGRESS — La Fontana Menu.tsx Fix

## Stato: COMPLETATO ✅
## Ultima fase completata: FASE 5 — Verifica Finale
## Prossimo step: Nessuno — lavoro completato

---

## FASE 1 — Diagnostica (completata)

| Check | Risultato |
|---|---|
| 1.1 Parsing JSX | ✅ File termina correttamente (riga 398 originale) |
| 1.2 Renderer attivi | ✅ 1 sola istanza di `new THREE.WebGLRenderer` |
| 1.3 Cleanup | ✅ `cancelAnimationFrame`, `renderer?.dispose()`, `observer.disconnect()` presenti |
| 1.4 IntersectionObserver | ⚠️ Presente ma solo per pausa animazione — mancava lazy-mount delle card |
| 1.5 Caricamento Three.js | ⚠️ Flag `threeLoaded` presente ma mancava `threeLoadPromise` (race condition) |

### Problemi aggiuntivi trovati:
- `antialias: true` → dovrebbe essere `false`
- Mancava `powerPreference: 'low-power'`
- `pixelRatio` variabile (fino a 1.5) → dovrebbe essere fisso a 1
- Mancava guard su context loss dopo creazione renderer
- `motion.div` lista mancava `key={attiva}` → tab switch non re-animava i figli

---

## FASE 2 — Stabilizzazione (completata)

### Delta applicati a `components/Menu.tsx`:

| Step | Fix | Riga(e) |
|---|---|---|
| 2.1 | Non necessario — parsing JSX già OK | — |
| 2.2 | WebGLRenderer: `antialias: false`, `powerPreference: 'low-power'`, `pixelRatio: 1`, guard `getContext()` | 140-157 |
| 2.3 | Cleanup: ordine corretto `cancelAnimationFrame → observer.disconnect → renderer.dispose` | 209-215 |
| 2.4 | `threeLoadPromise` per deduplicare caricamenti concorrenti Three.js | 73-103 |
| 2.5 | Nuovo componente `PiattoCard` con IntersectionObserver per lazy-mount Model3D | 224-282 |
| extra | `key={attiva}` su `motion.div` lista per re-trigger animazione su tab switch | 431 |

---

## FASE 3 — Refactor Architettura (già implementato)

| Step | Stato |
|---|---|
| 3.1 Dati dinamici da API | ✅ Già presente: `fetch('/api/menu')` con fallback a `FALLBACK_PIATTI` |
| 3.2 Skeleton loading | ✅ Già presente: componente `MenuSkeleton` |
| 3.3 Path .glb dinamici | ✅ Già presente: campo `glb` dal DB, formato `/models/nomefile.glb` |

---

## FASE 4 — Validazione Funzionale (completata)

| Test | Risultato |
|---|---|
| 4.1 API menu | ✅ JSON array con 4 piatti e 3 categorie dal DB Neon |
| 4.2 Fallback offline | ✅ Dati statici mostrati con avviso "Menu caricato in modalità offline" |
| 4.3 Filtri categorie | ✅ Panini/Carne/Aperitivo funzionanti, nessun tab "Tutto" |
| 4.4 Mobile (390px) | ✅ Card leggibili, 3D visibili, nessun freeze dopo 30s di scroll |

---

## FASE 5 — Checklist Finale

| Criterio | Verifica |
|---|---|
| `npm run dev` senza errori parsing | ✅ |
| Pagina principale carica senza schermo bianco | ✅ |
| Menu mostra piatti con filtri | ✅ |
| Nessun crash WebGL su sezione Panini | ✅ |
| Modelli 3D montati solo quando visibili | ✅ |
| Max 1 renderer attivo per card visibile | ✅ |
| Cleanup completo (cancelAnimationFrame + dispose + disconnect) | ✅ |
| Fallback statico funzionante se API non risponde | ✅ |
| Nessuna regressione negli altri componenti | ✅ |

**Tutti i criteri superati.**

---

## File modificati:
- `components/Menu.tsx` (unico file modificato, solo delta)

## Rischi residui noti:
- Three.js caricato da CDN esterno (dipendenza da rete)
- Draco decoder caricato da `gstatic.com` (dipendenza da Google CDN)
- Framer Motion è una dipendenza pre-esistente nel progetto (non introdotta da questo fix)
