import { motion } from 'framer-motion'
import { Clock, Leaf, Zap, ChevronRight } from 'lucide-react'

interface Recipe {
  title: string
  price: string
  time: string
  tags: { label: string; icon: typeof Clock; color: string }[]
  img: string
}

const RECIPES: Recipe[] = [
  {
    title: 'Pâtes carbonara express',
    price: 'à partir de 1,80 €',
    time: '15 min',
    tags: [
      { label: 'Rapide', icon: Zap, color: 'text-yellow-400' },
      { label: 'Protéiné', icon: Zap, color: 'text-emerald-400' },
    ],
    img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=400&q=80&fit=crop',
  },
  {
    title: 'Riz sauté aux légumes',
    price: 'à partir de 1,20 €',
    time: '20 min',
    tags: [
      { label: 'Végé', icon: Leaf, color: 'text-emerald-400' },
      { label: 'Rapide', icon: Zap, color: 'text-yellow-400' },
    ],
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=400&q=80&fit=crop',
  },
  {
    title: 'Omelette champignons',
    price: 'à partir de 1,50 €',
    time: '10 min',
    tags: [
      { label: 'Protéiné', icon: Zap, color: 'text-emerald-400' },
      { label: 'Rapide', icon: Zap, color: 'text-yellow-400' },
    ],
    img: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&h=400&q=80&fit=crop',
  },
  {
    title: 'Salade composée fraîche',
    price: 'à partir de 1,90 €',
    time: '10 min',
    tags: [
      { label: 'Végé', icon: Leaf, color: 'text-emerald-400' },
      { label: 'Léger', icon: Leaf, color: 'text-cyan-400' },
    ],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&q=80&fit=crop',
  },
  {
    title: 'Soupe de lentilles corail',
    price: 'à partir de 0,90 €',
    time: '25 min',
    tags: [
      { label: 'Végé', icon: Leaf, color: 'text-emerald-400' },
      { label: 'Protéiné', icon: Zap, color: 'text-emerald-400' },
    ],
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&q=80&fit=crop',
  },
]

interface RecipesShowcaseProps {
  onStart?: () => void
}

export function RecipesShowcase({ onStart }: RecipesShowcaseProps) {
  return (
    <section className="relative bg-slate-950 py-28 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px]
                        bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.3em] mb-4 block">
            Nos recettes étudiantes
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Des plats vrais,
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
              des prix honnêtes
            </span>
          </h2>
          <p className="mt-5 text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Chaque recette est calibrée pour coûter le moins cher possible
            dans ton supermarché, sans compromis sur le goût.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECIPES.map((recipe, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.65,
                delay: i * 0.12,
                type: 'spring',
                stiffness: 90,
                damping: 17,
              }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
              className="relative bg-slate-900 border border-slate-800
                         rounded-3xl overflow-hidden cursor-default
                         shadow-[0_0_30px_rgba(0,0,0,0.3)]"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <motion.img
                  src={recipe.img}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.5 }}
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-900" />

                {/* Price badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm
                                   text-white text-xs font-bold px-3 py-1.5 rounded-full
                                   shadow-[0_0_16px_rgba(16,185,129,0.4)]">
                    {recipe.price}
                  </span>
                </div>

                {/* Time badge */}
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm
                                   text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-full
                                   border border-slate-700">
                    <Clock className="w-3 h-3" />
                    {recipe.time}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 pt-4">
                <h3 className="text-base font-bold text-white mb-3 leading-snug">
                  {recipe.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag, j) => (
                    <span key={j}
                      className="inline-flex items-center gap-1 text-xs font-medium
                                 bg-slate-800 border border-slate-700/60
                                 text-zinc-400 px-2.5 py-1 rounded-full">
                      <tag.icon className={`w-3 h-3 ${tag.color}`} />
                      {tag.label}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  onClick={onStart}
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-full flex items-center justify-between
                             text-sm font-semibold text-emerald-400
                             border border-emerald-500/20 rounded-xl
                             px-4 py-2.5 hover:bg-emerald-500/5 transition-colors"
                >
                  Générer cette liste
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Coming soon card */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.65,
              delay: RECIPES.length * 0.12,
              type: 'spring',
              stiffness: 90,
              damping: 17,
            }}
            className="relative bg-slate-900/40 border border-slate-800/50
                       rounded-3xl overflow-hidden flex flex-col
                       items-center justify-center min-h-[280px] gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700
                            flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-zinc-500 text-sm font-medium text-center px-8">
              50+ recettes supplémentaires
              <br />
              <span className="text-zinc-600">disponibles bientôt</span>
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12"
        >
          <button
            disabled
            className="inline-flex items-center gap-2 text-sm font-semibold
                       text-zinc-600 border border-slate-800 rounded-full
                       px-6 py-3 cursor-not-allowed"
          >
            Voir toutes les recettes
            <span className="text-xs bg-slate-800 text-zinc-500 px-2 py-0.5 rounded-full">
              bientôt
            </span>
          </button>
        </motion.div>

      </div>
    </section>
  )
}
