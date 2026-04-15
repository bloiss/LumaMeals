import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useGenerate } from './hooks/useGenerate'
import { GenerateForm } from './components/GenerateForm'
import { ResultCard } from './components/ResultCard'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export default function App() {
  const { result, loading, error, generate, reset } = useGenerate()

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-10 gap-5">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl"
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
          Luma<span className="text-violet-400">Meals</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-zinc-400 text-base max-w-sm"
        >
          Cuisine bien. Dépense moins.
        </motion.p>
      </section>

      {/* ── Form / Result / Error ── */}
      <section className="flex-1 px-6 pb-16">
        <AnimatePresence mode="wait">

          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ResultCard result={result} onReset={reset} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GenerateForm onSubmit={generate} loading={loading} />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-xl mx-auto mt-4 rounded-xl border border-red-800
                             bg-red-950/40 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 py-5 text-center text-zinc-600 text-xs">
        LumaMeals — manger bien sans se ruiner
      </footer>

    </main>
  )
}
