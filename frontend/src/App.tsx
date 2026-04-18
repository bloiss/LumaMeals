import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGenerate } from './hooks/useGenerate'
import { useAuth } from './hooks/useAuth'
import { GenerateForm } from './components/GenerateForm'
import { ResultCard } from './components/ResultCard'
import { AuthForm } from './components/AuthForm'
import { HeroSection } from './components/HeroSection'
import { HowItWorks } from './components/HowItWorks'
import { RecipesShowcase } from './components/RecipesShowcase'
import { Footer } from './components/Footer'

export default function App() {
  const formRef = useRef<HTMLDivElement>(null)
  const { user, token, isAuthenticated, loading: authLoading, error: authError, signUp, signIn, signOut } = useAuth()
  const { result, loading: genLoading, error: genError, generate, reset } = useGenerate()

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen bg-slate-950 text-zinc-100 flex flex-col">

      {/* ── Landing — visible si non connecté et pas de résultat ── */}
      {!isAuthenticated && !result && (
        <>
          <HeroSection onStart={scrollToForm} />
          <HowItWorks />
          <RecipesShowcase onStart={scrollToForm} />
        </>
      )}

      {/* ── Header compact — visible si connecté ── */}
      {isAuthenticated && (
        <header className="sticky top-0 z-50 flex items-center justify-between
                           px-6 py-4 border-b border-slate-800/80
                           bg-slate-950/90 backdrop-blur">
          <span className="text-lg font-bold tracking-tight">
            Luma<span className="text-emerald-400">Meals</span>
          </span>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <span className="text-xs text-zinc-400 hidden sm:block">{user.email}</span>
                {user.is_student_verified && (
                  <span className="text-xs bg-cyan-500/10 text-cyan-400
                                   border border-cyan-500/20 px-2 py-0.5
                                   rounded-full font-semibold">
                    Étudiant
                  </span>
                )}
              </>
            )}
            <button
              onClick={signOut}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </header>
      )}

      {/* ── Section form / résultat ── */}
      <div ref={formRef} className="flex-1 px-6 py-16">
        <AnimatePresence mode="wait">

          {/* Connecté + résultat */}
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

          {/* Connecté + pas de résultat */}
          {isAuthenticated && !result && (
            <motion.div
              key="generate"
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
                  className="w-full max-w-xl mx-auto mt-4 rounded-xl
                             border border-red-800 bg-red-950/40
                             px-4 py-3 text-sm text-red-400"
                >
                  {genError}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Non connecté — formulaire auth */}
          {!isAuthenticated && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Prêt à cuisiner malin ?
                </h2>
                <p className="text-zinc-500 text-sm">
                  Crée ton compte pour accéder aux recettes et générer ta liste de courses.
                </p>
              </div>
              <AuthForm
                onSignUp={signUp}
                onSignIn={signIn}
                loading={authLoading}
                error={authError}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <Footer />

    </main>
  )
}
