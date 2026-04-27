import { motion } from 'framer-motion'
import { SlidersHorizontal, ShoppingCart, Sparkles } from 'lucide-react'

const STEPS = [
  {
    icon: SlidersHorizontal,
    number: '01',
    title: 'Choisis ta recette\net ton budget',
    desc: 'Sélectionne parmi nos recettes étudiantes et glisse le curseur jusqu\'à ton budget. Minimum 2 €, maximum 20 €.',
    color: 'emerald',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&q=80&fit=crop',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'L\'algo trouve\nles meilleurs prix',
    desc: 'Notre moteur Budget First calcule les produits les moins chers au centime près dans ton supermarché.',
    color: 'cyan',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&q=80&fit=crop',
  },
  {
    icon: ShoppingCart,
    number: '03',
    title: 'Ta liste de courses\nest prête',
    desc: 'Produit, marque, quantité exacte et prix total. Tu arrives en caisse sans surprise.',
    color: 'emerald',
    img: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=400&h=300&q=80&fit=crop',
  },
]

const colorMap = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    num: 'text-emerald-500/30',
    glow: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    icon: 'text-cyan-400',
    num: 'text-cyan-500/30',
    glow: 'shadow-[0_0_40px_rgba(6,182,212,0.12)]',
  },
}

export function HowItWorks() {
  return (
    <section className="relative bg-slate-950 py-28 px-6 overflow-hidden">

      {/* Ligne de connexion entre étapes (desktop) */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[60%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="max-w-7xl mx-auto">

        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.3em] mb-4 block">
            Comment ça marche
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            De la recette à la caisse
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
              en 30 secondes
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {STEPS.map((step, i) => {
            const c = colorMap[step.color as keyof typeof colorMap]
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.15,
                  type: 'spring',
                  stiffness: 100,
                  damping: 18,
                }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300 } }}
                className={`relative bg-slate-900 border ${c.border} rounded-3xl
                            overflow-hidden ${c.glow} cursor-default`}
              >
                {/* Image */}
                <div className="h-44 overflow-hidden">
                  <motion.img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5 }}
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 h-44 bg-linear-to-b from-transparent to-slate-900" />
                </div>

                <div className="p-7 pt-5">
                  {/* Numéro + icône */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-6xl font-black ${c.num} leading-none`}>
                      {step.number}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl ${c.bg} border ${c.border}
                                    flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${c.icon}`} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 whitespace-pre-line leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
