import Link from 'next/link'
import { Ear, Mic2, Sparkles } from 'lucide-react'
import type { SectionConfig } from '@/lib/constants'

const ICONS = { Mic2, Sparkles, Ear }

export function SectionCard({
  grade,
  section,
  count,
}: {
  grade: number
  section: SectionConfig
  count: number
}) {
  const Icon = ICONS[section.icon]
  return (
    <Link
      href={`/niveau/${grade}/${section.slug}`}
      className="group flex items-center gap-4 rounded-3xl bg-card p-5 shadow-md ring-1 ring-border transition-transform duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4"
      style={{ ['--tw-ring-color' as string]: `${section.color}55` }}
    >
      <span
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm sm:h-20 sm:w-20"
        style={{ backgroundColor: section.color }}
      >
        <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-display text-2xl font-bold text-card-foreground sm:text-3xl">
          {section.label}
        </span>
        <span className="text-base text-muted-foreground">{section.tagline}</span>
        <span className="mt-1 text-sm font-semibold" style={{ color: section.color }}>
          {count === 0
            ? 'Bientôt des activités'
            : `${count} activité${count > 1 ? 's' : ''}`}
        </span>
      </span>
    </Link>
  )
}
