import { notFound } from 'next/navigation'
import { getActivity } from '@/lib/activities'
import { getGrade, getSection } from '@/lib/constants'
import { BlockRenderer } from '@/components/block-renderer'
import { BackLink } from '@/components/back-link'

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const activityId = Number(id)
  if (!Number.isInteger(activityId)) notFound()

  const activity = await getActivity(activityId)
  if (!activity) notFound()

  const grade = getGrade(activity.grade)
  const section = getSection(activity.section)
  const color = section?.color ?? '#2AA9C4'

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-20 pt-6">
      <div className="flex justify-start">
        <BackLink
          href={`/niveau/${activity.grade}/${activity.section}`}
          label={section?.label ?? 'Retour'}
        />
      </div>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {grade ? (
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ backgroundColor: grade.color }}
            >
              {grade.label} {grade.sub}
            </span>
          ) : null}
          {section ? (
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ backgroundColor: section.color }}
            >
              {section.label}
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground text-balance">
          {activity.title}
        </h1>
        {activity.description ? (
          <p className="mt-2 text-lg text-muted-foreground text-pretty">
            {activity.description}
          </p>
        ) : null}
      </header>

      <div className="mt-8 flex flex-col gap-6">
        {activity.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} color={color} />
        ))}
      </div>
    </main>
  )
}
