/**
 * =============================================================================
 * SANITIZZAZIONE DATI — lib/sanitize.ts
 * =============================================================================
 * Funzioni per pulire i dati provenienti dal database prima di inviarli
 * al frontend. Previene attacchi XSS (Cross-Site Scripting).
 * 
 * COME FUNZIONA:
 * Quando un dato viene letto dal DB (es. il nome di un piatto), potrebbe
 * contenere codice HTML malevolo inserito da un attaccante. Queste funzioni
 * sostituiscono i caratteri pericolosi con le loro versioni "safe".
 * 
 * ESEMPIO:
 * Input:  "<script>alert('hack')</script>"
 * Output: "&lt;script&gt;alert(&#x27;hack&#x27;)&lt;/script&gt;"
 * → Il browser mostra il testo invece di eseguirlo come codice
 * =============================================================================
 */

/**
 * Escapa i caratteri HTML pericolosi in una stringa.
 * 
 * I 5 caratteri da escapare sono:
 * & → &amp;   (deve essere il primo, altrimenti escapa gli altri escape)
 * < → &lt;    (apre un tag HTML)
 * > → &gt;    (chiude un tag HTML)
 * " → &quot;  (chiude un attributo HTML con doppi apici)
 * ' → &#x27;  (chiude un attributo HTML con singolo apice)
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitizza un singolo record dal database.
 * Applica escapeHtml a tutti i campi stringa, lasciando intatti numeri e booleani.
 * 
 * @param record - Un oggetto con chiavi stringa e valori misti
 * @returns Lo stesso oggetto con le stringhe sanitizzate
 */
export function sanitizeRecord<T extends Record<string, unknown>>(record: T): T {
  const cleaned = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(record)) {
    // Se il valore è una stringa, la sanitizziamo
    if (typeof value === 'string') {
      cleaned[key] = escapeHtml(value);
    } else {
      // Numeri, booleani, null, undefined li lasciamo così
      cleaned[key] = value;
    }
  }
  return cleaned as T;
}

/**
 * Sanitizza un array di record dal database.
 * Usata nelle API Route per pulire tutti i risultati di una query.
 * 
 * ESEMPIO DI UTILIZZO NELLE API:
 * const piatti = await sql`SELECT * FROM piatti`;
 * return NextResponse.json(sanitizeRows(piatti));
 */
export function sanitizeRows<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map(row => sanitizeRecord(row));
}
