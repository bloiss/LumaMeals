import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RegisterRequest, LoginRequest } from '../types/api'

interface AuthFormProps {
  onSignUp: (req: RegisterRequest) => void
  onSignIn: (req: LoginRequest) => void
  loading: boolean
  error: string | null
}

export function AuthForm({ onSignUp, onSignIn, loading, error }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'register') {
      onSignUp({ email, password })
    } else {
      onSignIn({ email, password })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-6">

        {/* Toggle login / register */}
        <div className="flex bg-zinc-800 rounded-xl p-1 gap-1">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === m
                  ? 'bg-violet-500 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={mode === 'register' ? 'prenom@univ-rennes.fr' : 'ton@email.fr'}
              required
              autoComplete="email"
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm
                         text-zinc-100 placeholder-zinc-600 focus:outline-none
                         focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              required
              minLength={8}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm
                         text-zinc-100 placeholder-zinc-600 focus:outline-none
                         focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Hint email étudiant */}
          <AnimatePresence>
            {mode === 'register' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-zinc-500"
              >
                Utilise ton adresse universitaire (univ-*.fr, *.ac.fr, *.edu)
                pour bénéficier du tarif étudiant.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Erreur */}
          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800
                          rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-zinc-950 text-sm
                       bg-violet-500 hover:bg-violet-400 disabled:opacity-40
                       disabled:cursor-not-allowed transition-all"
          >
            {loading
              ? 'Chargement…'
              : mode === 'login' ? 'Se connecter' : 'Créer mon compte'
            }
          </button>
        </form>
      </div>
    </motion.div>
  )
}
