import { sql } from './db'
import type { Activity, Block } from './types'
import type { SectionSlug } from './constants'

type Row = {
  id: number
  grade: number
  section: string
  title: string
  description: string | null
  blocks: Block[]
  position: number
  created_at: string
  updated_at: string
}

function mapRow(row: Row): Activity {
  return {
    id: row.id,
    grade: row.grade,
    section: row.section as SectionSlug,
    title: row.title,
    description: row.description,
    blocks: Array.isArray(row.blocks) ? row.blocks : [],
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getActivities(
  grade: number,
  section: SectionSlug,
): Promise<Activity[]> {
  const rows = (await sql`
    SELECT * FROM activities
    WHERE grade = ${grade} AND section = ${section}
    ORDER BY position ASC, created_at DESC
  `) as Row[]
  return rows.map(mapRow)
}

export async function getAllActivities(): Promise<Activity[]> {
  const rows = (await sql`
    SELECT * FROM activities
    ORDER BY grade ASC, section ASC, position ASC, created_at DESC
  `) as Row[]
  return rows.map(mapRow)
}

export async function getActivity(id: number): Promise<Activity | null> {
  const rows = (await sql`SELECT * FROM activities WHERE id = ${id}`) as Row[]
  return rows[0] ? mapRow(rows[0]) : null
}

export async function getSectionCounts(
  grade: number,
): Promise<Record<string, number>> {
  const rows = (await sql`
    SELECT section, COUNT(*)::int AS count
    FROM activities
    WHERE grade = ${grade}
    GROUP BY section
  `) as { section: string; count: number }[]
  const counts: Record<string, number> = {}
  for (const r of rows) counts[r.section] = r.count
  return counts
}

export type ActivityInput = {
  grade: number
  section: SectionSlug
  title: string
  description: string | null
  blocks: Block[]
}

export async function createActivity(input: ActivityInput): Promise<number> {
  const rows = (await sql`
    INSERT INTO activities (grade, section, title, description, blocks, position)
    VALUES (
      ${input.grade},
      ${input.section},
      ${input.title},
      ${input.description},
      ${JSON.stringify(input.blocks)}::jsonb,
      ${Date.now()}
    )
    RETURNING id
  `) as { id: number }[]
  return rows[0].id
}

export async function updateActivity(
  id: number,
  input: ActivityInput,
): Promise<void> {
  await sql`
    UPDATE activities SET
      grade = ${input.grade},
      section = ${input.section},
      title = ${input.title},
      description = ${input.description},
      blocks = ${JSON.stringify(input.blocks)}::jsonb,
      updated_at = now()
    WHERE id = ${id}
  `
}

export async function deleteActivity(id: number): Promise<void> {
  await sql`DELETE FROM activities WHERE id = ${id}`
}
