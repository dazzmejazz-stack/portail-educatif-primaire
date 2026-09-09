import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, LogOut } from 'lucide-react'
import { isTeacher } from '@/lib/auth'
import { getAllActivities } from '@/lib/activities'
import { logoutAction } from '@/app/actions/teacher'
import { ActivityList } from '@/components/teacher/activity-list'

export default async function DashboardPage() {
  if (!(await isTeacher())) redirect('/enseignant')

  const activities = await getAllActivities()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-20 pt-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            Mes activités
          </h1>
          <p className="text-base text-muted-foreground">
            {activities.length} activité{activities.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm ring-1 ring-border transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Quitter
          </button>
        </form>
      </header>

      <Link
        href="/enseignant/tableau/nouvelle"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-display text-lg font-bold text-primary-foreground shadow-md transition-transform duration-150 active:scale-[0.98]"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
        Nouvelle activité
      </Link>

      <section className="mt-8">
        <ActivityList activities={activities} />
      </section>
    </main>
  )
}
