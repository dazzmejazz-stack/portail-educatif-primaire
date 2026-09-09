import { notFound } from 'next/navigation'
import { Ear, Mic2, Sparkles } from 'lucide-react'
import { getGrade, getSection, isValidSection } from '@/lib/constants'
import { getActivities } from '@/lib/activities'
import { ActivityCard } from '@/components/activity-card'
import { BackLink } from '@/components/back-link'

const ICONS = { Mic2, Sparkles, Ear }

export default async function SectionPage({
  params,
}: {
  params: Promise<{ grade: string; section: string }>
}) {
  const { grade: gradeParam, section: sectionParam } = await params
  const gradeNum = Number(gradeParam)
  const grade = getGrade(gradeNum)
  const section = getSection(sectionParam)
  if (!grade || !section || !isValidSection(sectionParam)) notFound()

  const activities = await getActivities(gradeNum, sectionParam)
  const Icon = ICONS[section.icon]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-16 pt-6">
      <div className="flex justify-start">
        <BackLink href={`/niveau/${gradeNum}`} label={`${grade.label} ${grade.sub}`} />
      </div>

      <header className="mt-6 flex items-center gap-4">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-white shadow-lg"
          style={{ backgroundColor: section.color }}
        >
          <Icon className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            {section.label}
          </h1>
          <p className="text-lg text-muted-foreground">{section.tagline}</p>
        </div>
      </header>

      <section className="mt-8 flex flex-col gap-4" aria-label="Activités">
        {activities.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
            <p className="font-display text-xl font-bold text-card-foreground">
              Bientôt !
            </p>
            <p className="mt-1 text-base text-muted-foreground text-pretty">
              Il n&apos;y a pas encore d&apos;activité ici. Reviens plus tard.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              color={section.color}
            />
          ))
        )}
      </section>
    </main>
  )
}
