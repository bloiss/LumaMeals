import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail } from 'lucide-react'

/* ─────────────────────────────────────────────
   Données légales
───────────────────────────────────────────── */

const CGU_CONTENT = `
**CONDITIONS GÉNÉRALES D'UTILISATION — LUMEAMEALS**
*Dernière mise à jour : 18 avril 2025*

**Article 1 — Objet**
Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du service LumaMeals, accessible à l'adresse lumeameals.fr (ci-après « le Service »), édité par LumaMeals (ci-après « l'Éditeur »). En accédant au Service, l'utilisateur (ci-après « l'Utilisateur ») accepte sans réserve les présentes CGU.

**Article 2 — Description du Service**
LumaMeals est un service en ligne permettant aux étudiants de générer des listes de courses optimisées en fonction d'un budget défini. Le Service s'appuie sur des données de prix collectées auprès de différentes enseignes de grande distribution. LumaMeals n'est pas une boutique en ligne et ne réalise aucune vente de produits alimentaires.

**Article 3 — Accès au Service**
L'accès au Service nécessite la création d'un compte via une adresse e-mail valide. L'Utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. L'Éditeur se réserve le droit de suspendre ou supprimer tout compte en cas d'utilisation abusive ou contraire aux présentes CGU.

**Article 4 — Propriété intellectuelle**
L'ensemble des éléments constituant le Service (textes, visuels, code source, algorithmes, marque « LumaMeals ») est protégé par le droit de la propriété intellectuelle. Toute reproduction, modification ou exploitation non autorisée est strictement interdite.

**Article 5 — Données personnelles**
L'Éditeur collecte l'adresse e-mail de l'Utilisateur dans le seul but de gérer l'accès au Service. Ces données ne sont ni revendues ni transmises à des tiers. L'Utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données en contactant l'Éditeur à l'adresse hello@lumeameals.fr. Conformément au RGPD (Règlement (UE) 2016/679), toute demande sera traitée dans un délai de 30 jours.

**Article 6 — Exactitude des prix**
Les prix affichés par le Service sont fournis à titre indicatif et peuvent différer des prix réellement pratiqués en magasin. LumaMeals ne garantit pas l'exactitude, l'exhaustivité ou la mise à jour en temps réel des données de prix. L'Éditeur ne saurait être tenu responsable d'un écart de prix constaté en caisse.

**Article 7 — Responsabilité**
LumaMeals est mis à disposition « en l'état ». L'Éditeur ne garantit pas que le Service sera disponible de manière continue et ininterrompue. En aucun cas, l'Éditeur ne saurait être tenu responsable de dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Service.

**Article 8 — Modification des CGU**
L'Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Service. L'Utilisateur est invité à consulter régulièrement les CGU.

**Article 9 — Droit applicable**
Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
`

const MENTIONS_CONTENT = `
**MENTIONS LÉGALES — LUMEAMEALS**
*Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique (LCEN)*

**Éditeur du site**
Nom : LumaMeals
Statut : Projet en cours de structuration (statut juridique à définir)
E-mail : hello@lumeameals.fr
Directeur de la publication : Lois B.

**Hébergement**
Le Service est hébergé par des infrastructures cloud européennes. Les données sont stockées sur des serveurs situés dans l'Union Européenne, en conformité avec le RGPD.

**Propriété intellectuelle**
Le nom « LumaMeals », le logo et l'ensemble du contenu du Service (textes, visuels, code) sont la propriété exclusive de l'Éditeur. Toute reproduction totale ou partielle sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.

**Données personnelles (RGPD)**
Le Service collecte uniquement l'adresse e-mail de l'Utilisateur à des fins d'authentification. Aucun autre traitement de données personnelles n'est effectué. Les données ne sont pas cédées à des tiers. L'Utilisateur dispose des droits suivants :
- Droit d'accès (art. 15 RGPD)
- Droit de rectification (art. 16 RGPD)
- Droit à l'effacement (art. 17 RGPD)
- Droit à la portabilité (art. 20 RGPD)
Pour exercer ces droits, contactez : hello@lumeameals.fr

**Cookies**
Le Service n'utilise pas de cookies de traçage ou publicitaires. Un token d'authentification (JWT) est stocké dans le localStorage du navigateur afin de maintenir la session de l'Utilisateur. Ce token est supprimé lors de la déconnexion.

**Liens hypertextes**
Le Service peut contenir des liens vers des sites tiers. LumaMeals n'est pas responsable du contenu de ces sites ni de leur politique de confidentialité.

**Droit applicable et juridiction**
Tout litige relatif à l'utilisation du Service est soumis au droit français. Le tribunal compétent sera celui du ressort du domicile de l'Éditeur.

**Médiation**
En cas de litige, l'Utilisateur peut recourir à la plateforme européenne de règlement des litiges en ligne : ec.europa.eu/consumers/odr
`

/* ─────────────────────────────────────────────
   Composant accordéon pour les blocs légaux
───────────────────────────────────────────── */

function LegalAccordion({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between
                   px-6 py-4 text-left
                   text-sm font-semibold text-zinc-300
                   hover:bg-slate-800/40 transition-colors"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-slate-800">
              {content.trim().split('\n\n').map((block, i) => {
                // Bold text support (**...**)
                const rendered = block.trim()
                if (!rendered) return null
                return (
                  <p key={i} className="text-xs text-zinc-500 leading-relaxed mb-3 last:mb-0"
                    dangerouslySetInnerHTML={{
                      __html: rendered
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-zinc-300">$1</strong>')
                        .replace(/\n/g, '<br />')
                    }}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Footer principal
───────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">

      {/* ── Bloc principal ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-xl font-black tracking-tight text-white mb-3">
              Luma<span className="text-emerald-400">Meals</span>
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              Manger bien sans se ruiner.
              <br />
              L'outil de courses intelligent pour les étudiants.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:hello@lumeameals.fr"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700
                           flex items-center justify-center
                           text-zinc-500 hover:text-zinc-300 hover:border-slate-600
                           transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700
                           flex items-center justify-center
                           text-zinc-500 hover:text-zinc-300 hover:border-slate-600
                           transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Produit */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">
              Produit
            </p>
            <ul className="space-y-2.5">
              {['Recettes', 'Générateur de liste', 'Comment ça marche', 'Tarifs'].map(item => (
                <li key={item}>
                  <span className="text-sm text-zinc-500 hover:text-zinc-300
                                   transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">
              Légal
            </p>
            <ul className="space-y-2.5">
              {['Mentions légales', 'CGU', 'Politique de confidentialité', 'RGPD'].map(item => (
                <li key={item}>
                  <span className="text-sm text-zinc-500 hover:text-zinc-300
                                   transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">
              Contact
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:hello@lumeameals.fr"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  hello@lumeameals.fr
                </a>
              </li>
              <li>
                <span className="text-sm text-zinc-600 cursor-default">
                  Support disponible 7j/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Accordéons légaux ── */}
        <div className="border-t border-slate-800 pt-12">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-6">
            Documents légaux
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LegalAccordion
              title="Conditions Générales d'Utilisation (CGU)"
              content={CGU_CONTENT}
            />
            <LegalAccordion
              title="Mentions Légales"
              content={MENTIONS_CONTENT}
            />
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="border-t border-slate-800 mt-12 pt-8
                        flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © 2025 LumaMeals — fait avec passion pour les étudiants
          </p>
          <p className="text-xs text-zinc-700">
            Les prix affichés sont indicatifs et peuvent varier en magasin.
          </p>
        </div>

      </div>
    </footer>
  )
}
