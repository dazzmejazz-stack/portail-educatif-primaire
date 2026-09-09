import { redirect } from 'next/navigation'
import { isTeacher } from '@/lib/auth'
import { ActivityForm } from '@/components/teacher/activity-form'
import { BackLink } from '@/components/back-link'

export default async function NewActivityPage() {
  if (!(await isTeacher())) redirect('/enseignant')

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-16 pt-6">
      <div className="flex justify-start">
        <BackLink href="/enseignant/tableau" label="Mes activités" />
      </div>
      <h1 className="mb-6 mt-6 font-display text-3xl font-extrabold text-foreground">
        Nouvelle activité
      </h1>
      <ActivityForm />
    </main>
  )
}
