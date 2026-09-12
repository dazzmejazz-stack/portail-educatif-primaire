'use client'
import { upload } from '@vercel/blob/client'
import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  Music2,
  Plus,
  Trash2,
  Type,
  Upload,
  Video,
} from 'lucide-react'
import { GRADES, SECTIONS } from '@/lib/constants'
import type { Block, BlockType } from '@/lib/types'
import { saveActivityAction } from '@/app/actions/teacher'

type Props = {
  initial?: {
    id: number
    grade: number
    section: string
    title: string
    description: string | null
    blocks: Block[]
  }
}

function newId() {
  return Math.random().toString(36).slice(2, 10)
}

function emptyBlock(type: BlockType): Block {
  switch (type) {
    case 'text':
      return { id: newId(), type, content: '' }
    case 'image':
      return { id: newId(), type, url: '', alt: '' }
    case 'video':
      return { id: newId(), type, url: '' }
    case 'audio':
      return { id: newId(), type, url: '', name: '' }
    case 'link':
      return { id: newId(), type, url: '', label: '' }
    case 'pdf':
      return { id: newId(), type, url: '', name: '' }
  }
}

const BLOCK_BUTTONS: { type: BlockType; label: string; icon: typeof Type }[] = [
  { type: 'text', label: 'Texte', icon: Type },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'video', label: 'Vidéo', icon: Video },
  { type: 'audio', label: 'Audio', icon: Music2 },
  { type: 'link', label: 'Lien', icon: Link2 },
  { type: 'pdf', label: 'Partition PDF', icon: FileText },
]

export function ActivityForm({ initial }: Props) {
  const router = useRouter()
const [grades, setGrades] = useState<number[]>([initial?.grade ?? GRADES[0].n])
  const [section, setSection] = useState(initial?.section ?? SECTIONS[0].slug)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [blocks, setBlocks] = useState<Block[]>(initial?.blocks ?? [])
  const [error, setError] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  function addBlock(type: BlockType) {
    setBlocks((prev) => [...prev, emptyBlock(type)])
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)),
    )
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  function move(id: string, dir: -1 | 1) {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function handleSubmit() {
    setError(null)
    if (!title.trim()) {
      setError('Ajoute un titre à ton activité.')
      return
    }
    startSaving(async () => {
      const res = await saveActivityAction({
        id: initial?.id,
        grade,
        section,
        title,
        description,
        blocks,
      })
      if (res.ok) {
        window.location.href = '/enseignant/tableau'
  
      } else {
        setError(res.error ?? 'Une erreur est survenue.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h2 className="mb-4 font-display text-xl font-bold text-card-foreground">
          Où publier ?
        </h2>

        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-semibold text-muted-foreground">
            Année
          </legend>
          <div className="flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <button
                key={g.n}
                type="button"
                onClick={() =>
  setGrades((prev) =>
    prev.includes(g.n)
      ? prev.filter((n) => n !== g.n)
      : [...prev, g.n]
  )
}
                className="rounded-xl px-4 py-2 font-display text-base font-bold text-white transition-transform active:scale-95"
                style={{
                  backgroundColor: g.color,
                 outline: grades.includes(g.n) ? '3px solid var(--foreground)' : 'none',
                  outlineOffset: 2,
                 opacity: grades.includes(g.n) ? 1 : 0.55,
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-muted-foreground">
            Section
          </legend>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setSection(s.slug)}
                className="rounded-xl px-4 py-2 font-display text-base font-bold text-white transition-transform active:scale-95"
                style={{
                  backgroundColor: s.color,
                  outline:
                    section === s.slug ? '3px solid var(--foreground)' : 'none',
                  outlineOffset: 2,
                  opacity: section === s.slug ? 1 : 0.55,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border">
        <label
          htmlFor="title"
          className="mb-2 block font-display text-xl font-bold text-card-foreground"
        >
          Titre
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex : La chanson des saisons"
          className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-lg text-foreground outline-none transition-colors focus:border-primary"
        />
        <label
          htmlFor="description"
          className="mb-2 mt-4 block font-display text-lg font-bold text-card-foreground"
        >
          Petite consigne (facultatif)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Une phrase simple pour expliquer l'activité."
          className="w-full resize-y rounded-2xl border-2 border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold text-foreground">Contenu</h2>
        {blocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            block={block}
            index={index}
            total={blocks.length}
            onUpdate={updateBlock}
            onRemove={removeBlock}
            onMove={move}
          />
        ))}

        <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-4">
          <p className="mb-3 text-center text-sm font-semibold text-muted-foreground">
            Ajouter un élément
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BLOCK_BUTTONS.map((b) => {
              const Icon = b.icon
              return (
                <button
                  key={b.type}
                  type="button"
                  onClick={() => addBlock(b.type)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-3 text-sm font-bold text-secondary-foreground transition-transform active:scale-95"
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                  {b.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-base font-semibold text-destructive">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-4 flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/enseignant/tableau')}
          className="flex-1 rounded-2xl bg-card px-5 py-4 font-display text-lg font-bold text-card-foreground shadow-md ring-1 ring-border transition-transform active:scale-[0.98]"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-display text-lg font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : null}
          Enregistrer
        </button>
      </div>
    </div>
  )
}

function BlockEditor({
  block,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  block: Block
  index: number
  total: number
  onUpdate: (id: string, patch: Partial<Block>) => void
  onRemove: (id: string) => void
  onMove: (id: string, dir: -1 | 1) => void
}) {
  const LABELS: Record<BlockType, string> = {
    text: 'Texte',
    image: 'Image',
    video: 'Vidéo',
    audio: 'Audio',
    link: 'Lien',
    pdf: 'Partition PDF',
  }

  return (
    <div className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-base font-bold text-card-foreground">
          {LABELS[block.type]}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(block.id, -1)}
            disabled={index === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground disabled:opacity-40"
            aria-label="Monter"
          >
            <ChevronUp className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(block.id, 1)}
            disabled={index === total - 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground disabled:opacity-40"
            aria-label="Descendre"
          >
            <ChevronDown className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(block.id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
            aria-label="Supprimer l'élément"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <BlockFields block={block} onUpdate={onUpdate} />
    </div>
  )
}

function BlockFields({
  block,
  onUpdate,
}: {
  block: Block
  onUpdate: (id: string, patch: Partial<Block>) => void
}) {
  const inputClass =
    'w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-base text-foreground outline-none transition-colors focus:border-primary'

  if (block.type === 'text') {
    return (
      <textarea
        value={block.content}
        onChange={(e) => onUpdate(block.id, { content: e.target.value })}
        rows={4}
        placeholder="Écris ton texte ici..."
        className={`${inputClass} resize-y`}
      />
    )
  }

  if (block.type === 'video') {
    return (
      <div className="flex flex-col gap-2">
        <input
          value={block.url}
          onChange={(e) => onUpdate(block.id, { url: e.target.value })}
          placeholder="Lien YouTube, Vimeo ou vidéo (.mp4)"
          className={inputClass}
        />
        <UploadField
          accept="video/*"
          label="ou téléverser une vidéo"
          onUploaded={(url) => onUpdate(block.id, { url })}
        />
        {block.url ? <PreviewLink url={block.url} /> : null}
      </div>
    )
  }

  if (block.type === 'link') {
    return (
      <div className="flex flex-col gap-2">
        <input
          value={block.url}
          onChange={(e) => onUpdate(block.id, { url: e.target.value })}
          placeholder="https://..."
          className={inputClass}
        />
        <input
          value={block.label ?? ''}
          onChange={(e) => onUpdate(block.id, { label: e.target.value })}
          placeholder="Texte du bouton (facultatif)"
          className={inputClass}
        />
      </div>
    )
  }

  // image, audio, pdf — upload + url
  const accept =
    block.type === 'image'
      ? 'image/*'
      : block.type === 'audio'
        ? 'audio/*'
        : 'application/pdf'

  return (
    <div className="flex flex-col gap-2">
      <input
        value={block.url}
        onChange={(e) => onUpdate(block.id, { url: e.target.value })}
        placeholder={
          block.type === 'image'
            ? "Lien de l'image ou téléverser"
            : block.type === 'audio'
              ? 'Lien audio ou téléverser'
              : 'Lien du PDF ou téléverser'
        }
        className={inputClass}
      />
      <UploadField
        accept={accept}
        label={`Téléverser ${
          block.type === 'image'
            ? 'une image'
            : block.type === 'audio'
              ? 'un audio'
              : 'un PDF'
        }`}
        onUploaded={(url, name) => {
          if (block.type === 'image') onUpdate(block.id, { url })
          else onUpdate(block.id, { url, name: block.name || name })
        }}
      />
      {block.type === 'audio' || block.type === 'pdf' ? (
        <input
          value={block.name ?? ''}
          onChange={(e) => onUpdate(block.id, { name: e.target.value })}
          placeholder="Nom à afficher (facultatif)"
          className={inputClass}
        />
      ) : null}
      {block.type === 'image' && block.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.url || '/placeholder.svg'}
          alt=""
          className="mt-1 max-h-40 w-auto rounded-xl"
        />
      ) : null}
      {block.type !== 'image' && block.url ? <PreviewLink url={block.url} /> : null}
    </div>
  )
}

function UploadField({
  accept,
  label,
  onUploaded,
}: {
  accept: string
  label: string
  onUploaded: (url: string, name: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleFile(file: File) {
    setErr(null)
    setUploading(true)
    try {
      const blob = await upload(file.name, file, {
  access: 'public',
  handleUploadUrl: '/api/upload',
  multipart: true,
})

onUploaded(blob.url, file.name)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Échec du téléversement')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground transition-transform active:scale-95 disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        )}
        {uploading ? 'Téléversement...' : label}
      </button>
      {err ? <p className="mt-1 text-sm text-destructive">{err}</p> : null}
    </div>
  )
}

function PreviewLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
    >
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
      Vérifier le lien
    </a>
  )
}
