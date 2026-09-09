import type { SectionSlug } from './constants'

export type Block =
  | { id: string; type: 'text'; content: string }
  | { id: string; type: 'image'; url: string; alt?: string }
  | { id: string; type: 'video'; url: string }
  | { id: string; type: 'audio'; url: string; name?: string }
  | { id: string; type: 'link'; url: string; label?: string }
  | { id: string; type: 'pdf'; url: string; name?: string }

export type BlockType = Block['type']

export type Activity = {
  id: number
  grade: number
  section: SectionSlug
  title: string
  description: string | null
  blocks: Block[]
  position: number
  createdAt: string
  updatedAt: string
}
