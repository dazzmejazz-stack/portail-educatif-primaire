import { notFound } from 'next/navigation'
import { getGrade, SECTIONS } from '@/lib/constants'
import { getSectionCounts } from '@/lib/activities'
import { SectionCard } from '@/components/section-card'
import { BackLink } from '@/components/back-link'

export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>
}) {
  const { grade: gradeParam } = await params
  const gradeNum = Number(gradeParam)
  const grade = getGrade(gradeNum)
  if (!grade) notFound()

  const counts = await getSectionCounts(gradeNum)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-16 pt-6">
      <div className="flex justify-start">
        <BackLink href="/" label="Accueil" />
      </div>

      <header className="mt-6 flex items-center gap-4">
        <span
          className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl text-white shadow-lg"
          style={{ backgroundColor: grade.color }}
        >
          <span className="font-display text-3xl font-extrabold leading-none">
            {grade.label}
          </span>
          <span className="font-display text-sm font-semibold">{grade.sub}</span>
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            {grade.label} {grade.sub}
          </h1>
          <p className="text-lg text-muted-foreground">Que veux-tu faire ?</p>
        </div>
      </header>

      <section className="mt-8 flex flex-col gap-4" aria-label="Sections">
        {SECTIONS.map((section) => (
          <SectionCard
            key={section.slug}
            grade={gradeNum}
            section={section}
            count={counts[section.slug] ?? 0}
          />
        ))}
      </section>
    </main>
  )
}
