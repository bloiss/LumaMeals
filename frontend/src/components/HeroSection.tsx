import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingDown } from 'lucide-react'

// ─── Ingrédient flottant avec parallax scroll ─────────────────────────────────
interface IngredientProps {
  emoji: string
  top?: string; bottom?: string; left?: string; right?: string
  size: number        // rem
  speed: number       // déplacement px au scroll 0→800
  floatAmp?: number   // amplitude oscillation verticale px
  floatDur?: number   // durée cycle float en secondes
  blur?: number       // flou profondeur de champ
  delay?: number
  z?: number
}

function Ingredient({
  emoji, size, speed, floatAmp = 10, floatDur = 3.5, blur = 0, delay = 0, z = 10,
  ...pos
}: IngredientProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, speed])

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ ...pos, y, zIndex: z, filter: blur ? `blur(${blur}px)` : undefined }}
    >
      <motion.span
        style={{ fontSize: `${size}rem`, display: 'block', lineHeight: 1 }}
        animate={{ y: [-floatAmp / 2, floatAmp / 2, -floatAmp / 2], rotate: [-7, 7, -7] }}
        transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {emoji}
      </motion.span>
    </motion.div>
  )
}

// ─── HeroSection ──────────────────────────────────────────────────────────────
interface HeroSectionProps {
  onStart?: () => void
}

const TITLE = [
  { text: 'Cuisine',  accent: false },
  { text: 'bien.',    accent: false },
  { text: 'Dépense',  accent: false },
  { text: 'moins.',   accent: true  },
]

export function HeroSection({ onStart }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col"
    >
      {/* ── Ambient glow blobs ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px]
                        bg-emerald-500/8 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px]
                        bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px]
                        bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Ingrédients flottants ───────────────────────────────────────────── */}
      <Ingredient emoji="🍋" top="12%"  left="4%"   size={3.8} speed={-110} floatDur={4.2} delay={0}   z={5} />
      <Ingredient emoji="🍅" top="58%"  left="3%"   size={2.8} speed={90}   floatDur={3.1} delay={0.4} blur={2}   z={4} />
      <Ingredient emoji="🌿" top="22%"  right="4%"  size={3.2} speed={-85}  floatDur={5.0} delay={0.8} z={5} />
      <Ingredient emoji="🪙" top="68%"  right="6%"  size={2.2} speed={70}   floatDur={2.9} delay={0.2} blur={1.5} z={4} />
      <Ingredient emoji="🧄" top="42%"  right="13%" size={2.4} speed={-55}  floatDur={4.6} delay={1.1} blur={3}   z={3} />
      <Ingredient emoji="🫙" bottom="18%" left="9%" size={2.2} speed={65}   floatDur={3.8} delay={0.6} blur={2}   z={4} />

      {/* ── Contenu principal ──────────────────────────────────────────────── */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12
                      grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-28 lg:py-0">

        {/* ─ Colonne gauche : texte ─ */}
        <div className="flex flex-col gap-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 w-fit
                       bg-emerald-500/10 border border-emerald-500/20
                       rounded-full px-4 py-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              Prix temps réel · Tarif étudiant
            </span>
          </motion.div>

          {/* Titre mot par mot */}
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.02] tracking-tight text-white">
            {TITLE.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block mr-[0.2em] align-bottom">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.75,
                    delay: 0.25 + i * 0.11,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`inline-block ${
                    word.accent
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'
                      : ''
                  }`}
                >
                  {word.text}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: 'easeOut' }}
            className="text-zinc-400 text-lg max-w-md leading-relaxed"
          >
            On calcule les ingrédients les moins chers dans ton supermarché —{' '}
            <span className="text-white font-semibold">au centime près.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.88 }}
            className="flex items-center gap-5 flex-wrap"
          >
            <motion.button
              onClick={onStart}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  '0 0 36px rgba(16,185,129,0.45), 0 0 72px rgba(16,185,129,0.15)',
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="flex items-center gap-3
                         bg-gradient-to-r from-emerald-500 to-cyan-500
                         text-slate-950 font-bold px-8 py-4 rounded-2xl text-base
                         cursor-pointer"
            >
              Générer mon repas
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>

            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="flex items-center gap-2 text-zinc-500 text-sm
                         cursor-pointer hover:text-zinc-300 transition-colors"
            >
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              Comment ça marche ?
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex gap-10 pt-2 border-t border-slate-800"
          >
            {[
              { value: '< 5 €',  label: 'repas complet' },
              { value: '10+',    label: 'recettes' },
              { value: '2',      label: 'supermarchés' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col pt-4">
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─ Colonne droite : Spinning plate ─ */}
        <div className="relative flex items-center justify-center h-[480px]">

          {/* Glow sous le plat */}
          <div className="absolute inset-16 rounded-full
                          bg-gradient-to-br from-emerald-500/25 to-cyan-500/20 blur-3xl" />

          {/* Anneau extérieur — conic gradient rotatif */}
          <motion.div
            className="absolute w-[340px] h-[340px] rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 60%, rgba(16,185,129,0.4) 80%, transparent 100%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          />

          {/* Anneau intermédiaire counter-clockwise avec point cyan */}
          <motion.div
            className="absolute w-[280px] h-[280px] rounded-full border border-cyan-500/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2
                            w-3 h-3 rounded-full bg-cyan-400
                            shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2
                            w-2 h-2 rounded-full bg-emerald-400
                            shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </motion.div>

          {/* Le plat — anneau rotatif */}
          <motion.div
            className="absolute w-[220px] h-[220px] rounded-full
                       border-2 border-slate-700/50 bg-slate-900"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {/* Sillons du plat */}
            <div className="absolute inset-3 rounded-full border border-slate-700/25" />
            <div className="absolute inset-6 rounded-full border border-slate-700/15" />
          </motion.div>

          {/* Emoji plat — contre-rotation pour rester lisible */}
          <motion.div
            className="absolute flex items-center justify-center
                       w-[220px] h-[220px] rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <motion.span
              className="text-8xl"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🍝
            </motion.span>
          </motion.div>

          {/* Badge prix total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 220, damping: 18 }}
            className="absolute -top-4 -right-2 lg:-right-6
                       bg-slate-900/95 backdrop-blur border border-slate-700/50
                       rounded-2xl px-4 py-3 shadow-2xl"
          >
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Total courses
            </div>
            <div className="text-2xl font-black text-emerald-400 tabular-nums">4,48 €</div>
          </motion.div>

          {/* Badge économies */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 220, damping: 18 }}
            className="absolute -bottom-4 -left-2 lg:-left-6
                       bg-slate-900/95 backdrop-blur border border-slate-700/50
                       rounded-2xl px-4 py-3 shadow-2xl"
          >
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Économisé
            </div>
            <div className="text-xl font-bold text-cyan-400 tabular-nums">+ 0,52 €</div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20
                   flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
      >
        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">Défiler</span>
        <motion.div
          className="w-5 h-9 border border-zinc-700 rounded-full
                     flex items-start justify-center pt-1.5"
        >
          <motion.div
            className="w-1 h-2.5 bg-zinc-400 rounded-full"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
