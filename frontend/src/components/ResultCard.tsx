import { motion } from 'framer-motion'
import type { GenerateResult, MappedProduct } from '../types/api'
import { formatPrice, formatDuration, formatQuantity } from '../lib/format'

interface ResultCardProps {
  result: GenerateResult
  onReset: () => void
}

function IngredientRow({ mp, index }: { mp: MappedProduct; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex items-center justify-between gap-4 py-3
                 border-b border-zinc-800 last:border-0"
    >
      <div className="flex flex-col min-w-0">
        {/* Ingrédient générique */}
        <span className="text-xs text-zinc-500 uppercase tracking-wider">
          {formatQuantity(mp.quantity_needed, mp.mapping.unit)} de {mp.ingredient.name}
        </span>
        {/* Produit réel */}
        <span className="text-sm font-medium text-zinc-100 truncate">
          {mp.product.name}
        </span>
        <span className="text-xs text-zinc-500">
          {mp.product.brand} · {mp.packs_needed} paquet{mp.packs_needed > 1 ? 's' : ''}
        </span>
      </div>

      {/* Prix */}
      <div className="flex flex-col items-end shrink-0">
        <span className="text-sm font-bold text-zinc-100">
          {formatPrice(mp.cost_cents)}
        </span>
        {mp.packs_needed > 1 && (
          <span className="text-xs text-zinc-500">
            {mp.packs_needed} × {formatPrice(mp.price_cents)}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const { recipe, mapped_products, total_cost_cents, budget_cents, savings_cents, is_within_budget } = result

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto flex flex-col gap-4"
    >
      {/* ── En-tête recette ───────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-xl font-bold text-zinc-100">{recipe.name}</h2>
          <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
            is_within_budget
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {is_within_budget ? '✓ Dans le budget' : '✗ Hors budget'}
          </span>
        </div>

        <p className="text-sm text-zinc-400 mb-4">{recipe.description}</p>

        <div className="flex gap-4 text-xs text-zinc-500">
          {recipe.prep_time_min > 0 && (
            <span>⏱ Prép. {formatDuration(recipe.prep_time_min)}</span>
          )}
          {recipe.cook_time_min > 0 && (
            <span>🍳 Cuisson {formatDuration(recipe.cook_time_min)}</span>
          )}
          <span>👥 {recipe.servings} portions</span>
        </div>
      </div>

      {/* ── Liste ingrédients → produits ──────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Ingrédients
        </h3>
        <div className="flex flex-col">
          {mapped_products.map((mp, i) => (
            <IngredientRow key={mp.ingredient.id} mp={mp} index={i} />
          ))}
        </div>
      </div>

      {/* ── Récapitulatif budget ──────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-zinc-400">Total courses</span>
          <span className="text-2xl font-bold text-zinc-100">
            {formatPrice(total_cost_cents)}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-zinc-400">Ton budget</span>
          <span className="text-sm text-zinc-400">{formatPrice(budget_cents)}</span>
        </div>

        {/* Barre de progression budget */}
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all ${
              is_within_budget ? 'bg-violet-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((total_cost_cents / budget_cents) * 100, 100)}%` }}
          />
        </div>

        <div className={`text-center text-sm font-semibold ${
          is_within_budget ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {is_within_budget
            ? `Tu économises ${formatPrice(savings_cents)} 🎉`
            : `Dépasse de ${formatPrice(Math.abs(savings_cents))} — essaie un budget plus grand`
          }
        </div>
      </div>

      {/* ── Reset ─────────────────────────────────────────────── */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-400
                   text-sm hover:border-zinc-500 hover:text-zinc-200 transition-all"
      >
        ← Modifier ma recherche
      </button>
    </motion.div>
  )
}
