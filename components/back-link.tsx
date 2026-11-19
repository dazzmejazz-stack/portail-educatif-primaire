import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

const pill =
  'inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-base font-semibold text-card-foreground shadow-sm ring-1 ring-border transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40'

export function BackLink({ href, label }: { href: string; label: string }) {
  const back = (
    <Link href={href} className={pill}>
      <ArrowLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      {label}
    </Link>
  )

  // Quand le retour mène déjà à l'accueil, un seul bouton suffit.
  if (href === '/') return back

  return (
    <div className="flex flex-wrap items-center gap-2">
      {back}
      <Link href="/" className={`${pill} ring-2 ring-primary`}>
        <Home className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        Accueil
      </Link>
    </div>
  )
}
