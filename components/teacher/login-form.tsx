'use client'

import { useActionState } from 'react'
import { Lock, Loader2 } from 'lucide-react'
import { loginAction, type LoginState } from '@/app/actions/teacher'

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  )

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-display text-lg font-bold text-card-foreground"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-lg text-foreground outline-none transition-colors focus:border-primary"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-2 text-base font-semibold text-destructive">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-lg font-bold text-primary-foreground shadow-md transition-transform duration-150 active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <Lock className="h-5 w-5" aria-hidden="true" />
        )}
        Se connecter
      </button>
    </form>
  )
}
