import Link from 'next/link'
import {
  FileText,
  Image as ImageIcon,
  Link2,
  Music2,
  Type,
  Video,
} from 'lucide-react'
import type { Activity, BlockType } from '@/lib/types'

const TYPE_META: Record<BlockType, { icon: typeof Type; label: string }> = {
  text: { icon: Type, label: 'Texte' },
  image: { icon: ImageIcon, label: 'Image' },
  video: { icon: Video, label: 'Vidéo' },
  audio: { icon: Music2, label: 'Audio' },
  link: { icon: Link2, label: 'Lien' },
  pdf: { icon: FileText, label: 'Partition' },
}

export function ActivityCard({
  activity,
  color,
}: {
  activity: Activity
  color: string
}) {
  const types = Array.from(new Set(activity.blocks.map((b) => b.type)))

  return (
    <Link
      href={`/activite/${activity.id}`}
      className="group flex flex-col gap-3 rounded-3xl bg-card p-5 shadow-md ring-1 ring-border transition-transform duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4"
      style={{ ['--tw-ring-color' as string]: `${color}55` }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1 h-10 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold leading-snug text-card-foreground text-balance">
            {activity.title}
          </h3>
          {activity.description ? (
            <p className="mt-1 line-clamp-2 text-base text-muted-foreground">
              {activity.description}
            </p>
          ) : null}
        </div>
      </div>
      {types.length > 0 ? (
        <div className="flex flex-wrap gap-2 pl-5">
          {types.map((t) => {
            const Icon = TYPE_META[t].icon
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground"
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {TYPE_META[t].label}
              </span>
            )
          })}
        </div>
      ) : null}
    </Link>
  )
}
