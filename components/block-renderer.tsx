import { ExternalLink, FileText } from 'lucide-react'
import type { Block } from '@/lib/types'
import { isDirectVideo, youtubeEmbed } from '@/lib/media'

export function BlockRenderer({ block, color }: { block: Block; color: string }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="whitespace-pre-wrap text-lg leading-relaxed text-card-foreground">
          {block.content}
        </div>
      )

    case 'image':
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.url || '/placeholder.svg'}
          alt={block.alt || ''}
          className="w-full rounded-2xl shadow-sm"
        />
      )

    case 'video': {
      const embed = youtubeEmbed(block.url)
      if (embed) {
        return (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-sm">
            <iframe
              src={embed}
              title="Vidéo"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
      if (isDirectVideo(block.url)) {
        return (
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full rounded-2xl bg-black shadow-sm"
          >
            <source src={block.url} />
          </video>
        )
      }
      return <LinkButton url={block.url} label="Ouvrir la vidéo" color={color} />
    }

    case 'audio':
      return (
        <div className="rounded-2xl bg-muted p-4">
          {block.name ? (
            <p className="mb-2 font-display text-lg font-bold text-card-foreground">
              {block.name}
            </p>
          ) : null}
          <audio controls preload="metadata" className="w-full">
            <source src={block.url} />
          </audio>
        </div>
      )

    case 'link':
      return (
        <LinkButton
          url={block.url}
          label={block.label || block.url}
          color={color}
        />
      )

    case 'pdf':
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl p-5 text-white shadow-sm transition-transform duration-150 active:scale-[0.98]"
          style={{ backgroundColor: color }}
        >
          <FileText className="h-8 w-8 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <span className="min-w-0">
            <span className="block font-display text-lg font-bold">
              {block.name || 'Partition'}
            </span>
            <span className="text-sm text-white/85">Ouvrir la partition (PDF)</span>
          </span>
        </a>
      )

    default:
      return null
  }
}

function LinkButton({
  url,
  label,
  color,
}: {
  url: string
  label: string
  color: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-2xl bg-card px-5 py-4 text-lg font-semibold text-card-foreground shadow-sm ring-2 transition-transform duration-150 active:scale-[0.98]"
      style={{ borderColor: color, ['--tw-ring-color' as string]: color }}
    >
      <ExternalLink
        className="h-6 w-6 shrink-0"
        strokeWidth={2.5}
        aria-hidden="true"
        style={{ color }}
      />
      <span className="min-w-0 break-words">{label}</span>
    </a>
  )
}
