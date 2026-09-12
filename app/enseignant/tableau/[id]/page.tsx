import { notFound, redirect } from 'next/navigation'
import { isTeacher } from '@/lib/auth'
import { getActivityById } from '@/lib/activities'
import { ActivityForm } from '@/components/teacher/activity-form'
import { BackLink } from '@/components/back-link'

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await isTeacher())) redirect('/enseignant')

  const { id } = await params
  const activityId = Number(id)
  if (!Number.isInteger(activityId)) notFound()

  const activity = await getActivityById(activityId)
  if (!activity) notFound()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-16 pt-6">
      <div className="flex justify-start">
        <BackLink href="/enseignant/tableau" label="Mes activités" />
      </div>
      <h1 className="mb-6 mt-6 font-display text-3xl font-extrabold text-foreground">
        Modifier l&apos;activité
      </h1>
      <ActivityForm
        initial={{
          id: activity.id,
          grade: activity.grade,
          section: activity.section,
          title: activity.title,
          description: activity.description,
          blocks: activity.blocks,
        }}
      />
    </main>
  )
}
