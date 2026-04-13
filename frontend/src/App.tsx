import { motion, type Variants } from 'framer-motion'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const features = [
  { icon: '🛒', title: 'Prix en temps réel', desc: 'Scraping automatique des supermarchés locaux.' },
  { icon: '🎯', title: 'Budget au centime', desc: 'Aucun arrondi, aucune surprise à la caisse.' },
  { icon: '🎓', title: 'Tarif étudiant', desc: 'Vérifié par ton adresse mail universitaire.' },
  { icon: '✨', title: 'Vibes & recettes', desc: 'Des repas qui correspondent à ton humeur.' },
]

export default function App() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 gap-6">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-6xl"
        >
          🍽️
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl font-bold tracking-tight text-white"
        >
          Luma<span className="text-emerald-400">Meals</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-zinc-400 text-lg max-w-md"
        >
          Cuisine bien. Dépense moins. On trouve les ingrédients les moins chers
          dans ton supermarché, au centime près.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex gap-3 flex-wrap justify-center"
        >
          <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-3 rounded-xl transition-colors">
            Voir les recettes
          </button>
          <button className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-6 py-3 rounded-xl transition-colors">
            En savoir plus
          </button>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            custom={i + 4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-4 items-start"
          >
            <span className="text-3xl">{f.icon}</span>
            <div>
              <h3 className="font-semibold text-zinc-100 mb-1">{f.title}</h3>
              <p className="text-zinc-400 text-sm">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-zinc-800 py-6 text-center text-zinc-600 text-sm">
        LumaMeals — manger bien sans se ruiner
      </footer>

    </main>
  )
}
