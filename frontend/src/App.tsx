import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useGenerate } from './hooks/useGenerate'
import { useAuth } from './hooks/useAuth'
import { GenerateForm } from './components/GenerateForm'
import { ResultCard } from './components/ResultCard'
import { AuthForm } from './components/AuthForm'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export default function App() {
  const { user, token, isAuthenticated, loading: authLoading, error: authError, signUp, signIn, signOut } = useAuth()
  const { result, loading: genLoading, error: genError, generate, reset } = useGenerate()

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-bold tracking-tight"
        >
          Luma<span className="text-violet-400">Meals</span>
        </motion.span>

        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-zinc-400 hidden sm:block">{user.email}</span>
            {user.is_student_verified && (
              <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20
                               px-2 py-0.5 rounded-full font-semibold">
                Étudiant
              </span>
            )}
            <button
              onClick={signOut}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Déconnexion
            </button>
          </motion.div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-12 pb-8 gap-4">
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl font-bold tracking-tight text-white"
        >
          Cuisine bien.{' '}
          <span className="text-violet-400">Dépense moins.</span>
        </motion.h1>

        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-zinc-400 text-sm max-w-xs"
        >
          {isAuthenticated
            ? 'Choisis ta recette et ton budget — on trouve les produits les moins chers.'
            : 'Connecte-toi pour générer tes repas au meilleur prix.'
          }
        </motion.p>
      </section>

      {/* ── Content ── */}
      <section className="flex-1 px-6 pb-16">
        <AnimatePresence mode="wait">

          {/* Pas connecté → formulaire auth */}
          {!isAuthenticated && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AuthForm
                onSignUp={signUp}
                onSignIn={signIn}
                loading={authLoading}
                error={authError}
              />
            </motion.div>
          )}

          {/* Connecté + résultat → ResultCard */}
          {isAuthenticated && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ResultCard result={result} onReset={reset} />
            </motion.div>
          )}

          {/* Connecté + pas de résultat → GenerateForm */}
          {isAuthenticated && !result && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GenerateForm
                onSubmit={req => generate(req, token!)}
                loading={genLoading}
              />
              {genError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-xl mx-auto mt-4 rounded-xl border border-red-800
                             bg-red-950/40 px-4 py-3 text-sm text-red-400"
                >
                  {genError}
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
