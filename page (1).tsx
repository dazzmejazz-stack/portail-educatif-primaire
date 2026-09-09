import { redirect } from 'next/navigation'
import { Music } from 'lucide-react'
import { isTeacher } from '@/lib/auth'
import { LoginForm } from '@/components/teacher/login-form'
import { BackLink } from '@/components/back-link'

export default async function TeacherLoginPage() {
  if (await isTeacher()) redirect('/enseignant/tableau')

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-16 pt-6">
      <div className="flex justify-start">
        <BackLink href="/" label="Accueil" />
      </div>

      <div className="mt-10 flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
          <Music className="h-9 w-9" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-foreground">
          Espace enseignant
        </h1>
        <p className="mt-2 text-base text-muted-foreground text-pretty">
          Connecte-toi pour gérer les activités des élèves.
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-card p-6 shadow-md ring-1 ring-border">
        <LoginForm />
      </div>
    </main>
  )
}
