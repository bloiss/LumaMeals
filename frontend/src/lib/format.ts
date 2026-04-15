// Formatage des prix — RÈGLE : les prix circulent toujours en centimes (number entier).
// La division par 100 n'est faite QUE ici, pour l'affichage. Jamais ailleurs.

/**
 * Formate un prix en centimes vers une chaîne lisible.
 * Ex: 467 → "4,67 €"  |  89 → "0,89 €"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

/**
 * Formate une durée en minutes.
 * Ex: 65 → "1h05"  |  20 → "20 min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`
}

/**
 * Formate une quantité avec son unité.
 * Ex: (2.0, "100g") → "200g"  |  (1.0, "unité") → "1 unité"
 */
export function formatQuantity(quantity: number, unit: string): string {
  if (unit === '100g') {
    const grams = Math.round(quantity * 100)
    return grams >= 1000 ? `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 1)} kg` : `${grams} g`
  }
  if (unit === 'unité') return `${quantity} ${quantity > 1 ? 'unités' : 'unité'}`
  if (unit === 'tranche') return `${quantity} tranche${quantity > 1 ? 's' : ''}`
  return `${quantity} ${unit}`
}
