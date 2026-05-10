# La Fontana — Guida Deploy e Manutenzione

## Struttura del Progetto
- Root repo: contiene vercel.json e cartella la-fontana/
- la-fontana/: progetto Next.js completo

## Come fare deploy su Vercel
1. Vai su vercel.com → Add New Project → importa ndigital000/La-Fontana
2. Framework: Next.js
3. Root Directory: la-fontana
4. Environment Variables: aggiungi DATABASE_URL (vedi .env.local)
5. Clicca Deploy

## Variabili d'ambiente necessarie
- DATABASE_URL: stringa connessione Neon PostgreSQL (non committare mai nel repo)

## Come aggiornare il sito
1. Modifica i file in la-fontana/
2. git add . && git commit -m "descrizione" && git push
3. Vercel rideploya automaticamente

## Database
- Provider: Neon PostgreSQL
- Le credenziali sono in .env.local (non versionato)
- Script database in la-fontana/scripts/

## Sicurezza
- Headers di sicurezza configurati in next.config.ts
- Content Security Policy (CSP) attiva
- Input sanitizzato tramite lib/sanitize.ts
- Query SQL parametrizzate per prevenire SQL injection

## Struttura componenti
- Navbar, Hero, Menu, Cocktail, Bevande, Contatti, Footer
- Modelli 3D in public/models/ (formato .glb)
