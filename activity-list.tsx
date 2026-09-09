'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { deleteActivityAction } from '@/app/actions/teacher'
import { getGrade, getSection } from '@/lib/constants'
import type { Activity } from '@/lib/types'

export function ActivityList({ activities }: { activities: Activity[] }) {
  const [items, setItems] = useState(activities)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [, startTransition] = useTransition()

  function handleDelete(activity: Activity) {
    setPendingId(activity.id)
    startTransition(async () => {
      const res = await deleteActivityAction(
        activity.id,
        activity.grade,
        activity.section,
      )
      if (res.ok) {
        setItems((prev) => prev.filter((a) => a.id !== activity.id))
      }
      setPendingId(null)
      setConfirmId(null)
    })
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
        <p className="font-display text-xl font-bold text-card-foreground">
          Aucune activité
        </p>
        <p className="mt-1 text-base text-muted-foreground">
          Crée ta première activité avec le bouton ci-dessus.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((activity) => {
        const grade = getGrade(activity.grade)
        const section = getSection(activity.section)
        return (
          <li
            key={activity.id}
            className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border"
          >
            <div className="flex shrink-0 flex-col gap-1">
              <span
                className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: grade?.color ?? '#888' }}
              >
                {grade?.label ?? '?'}
              </span>
              <span
                className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: section?.color ?? '#888' }}
              >
                {section?.label ?? '?'}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-bold text-card-foreground">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.blocks.length} élément
                {activity.blocks.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/enseignant/tableau/${activity.id}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-transform active:scale-95"
                aria-label={`Modifier ${activity.title}`}
              >
                <Pencil className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              </Link>

              {confirmId === activity.id ? (
                <button
                  type="button"
                  onClick={() => handleDelete(activity)}
                  disabled={pendingId === activity.id}
                  className="inline-flex h-11 items-center gap-1 rounded-xl bg-destructive px-3 text-sm font-bold text-destructive-foreground transition-transform active:scale-95 disabled:opacity-60"
                >
                  {pendingId === activity.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  Confirmer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(activity.id)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-transform active:scale-95"
                  aria-label={`Supprimer ${activity.title}`}
                >
                  <Trash2 className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
