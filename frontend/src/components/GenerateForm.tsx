import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getRecipes, getSupermarkets } from '../api/generate'
import { formatPrice } from '../lib/format'
import type { Recipe, Supermarket, GenerateRequest } from '../types/api'

interface GenerateFormProps {
  onSubmit: (req: GenerateRequest) => void
  loading: boolean
}

// Budget min/max en centimes (int)
const BUDGET_MIN = 200   // 2,00 €
const BUDGET_MAX = 2000  // 20,00 €
const BUDGET_STEP = 50   // pas de 0,50 €

export function GenerateForm({ onSubmit, loading }: GenerateFormProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [budgetCents, setBudgetCents] = useState<number>(500)  // 5,00 € par défaut
  const [recipeId, setRecipeId] = useState<string>('')
  const [supermarketId, setSupermarketId] = useState<string>('')
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getRecipes(), getSupermarkets()])
      .then(([r, s]) => {
        setRecipes(r)
        setSupermarkets(s)
        if (r.length > 0) setRecipeId(r[0].id)
        if (s.length > 0) setSupermarketId(s[0].id)
      })
      .catch(() => setFetchError('Impossible de charger les données. Backend lancé ?'))
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!recipeId || !supermarketId) return
    // budgetCents est déjà un entier en centimes — on ne transforme pas
    onSubmit({ recipe_id: recipeId, budget_cents: budgetCents, supermarket_id: supermarketId })
  }

  if (fetchError) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/40 p-6 text-red-400 text-sm">
        {fetchError}
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto flex flex-col gap-6"
    >
      {/* ── Budget slider ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Budget
          </label>
          <span className="text-3xl font-bold text-violet-400">
            {formatPrice(budgetCents)}
          </span>
        </div>
        <input
          type="range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={budgetCents}
          onChange={e => setBudgetCents(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
                     bg-zinc-800 accent-violet-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>{formatPrice(BUDGET_MIN)}</span>
          <span>{formatPrice(BUDGET_MAX)}</span>
        </div>
      </div>

      {/* ── Supermarché ───────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
          Supermarché
        </label>
        <div className="flex gap-3">
          {supermarkets.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSupermarketId(s.id)}
              className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                supermarketId === s.id
                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Recette ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
          Recette
        </label>
        <select
          value={recipeId}
          onChange={e => setRecipeId(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100
                     rounded-xl px-4 py-3 text-sm focus:outline-none
                     focus:border-violet-500 transition-colors"
        >
          {recipes.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── Submit ────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading || !recipeId || !supermarketId}
        className="w-full py-4 rounded-xl font-bold text-zinc-950 text-base
                   bg-violet-500 hover:bg-violet-400 disabled:opacity-40
                   disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Calcul en cours…' : 'Générer mon repas'}
      </button>
    </motion.form>
  )
}
