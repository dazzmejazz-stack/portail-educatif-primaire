import Link from 'next/link'
import { Music, Lock } from 'lucide-react'
import { GRADES } from '@/lib/constants'
import { GradeCard } from '@/components/grade-card'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pb-16 pt-10">
      <header className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
          <Music className="h-9 w-9" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-foreground text-balance sm:text-5xl">
          Ma classe de musique
        </h1>
        <p className="mt-2 text-lg text-muted-foreground text-pretty">
          Choisis ton année pour voir tes activités.
        </p>
      </header>

      <section className="mt-10" aria-label="Choisir une année">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {GRADES.map((grade) => (
            <GradeCard key={grade.n} grade={grade} />
          ))}
        </div>
      </section>

      <footer className="mt-auto flex justify-center pt-12">
        <Link
          href="/enseignant"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          Espace enseignant
        </Link>
      </footer>
    </main>
  )
}
