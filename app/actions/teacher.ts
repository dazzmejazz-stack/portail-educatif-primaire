'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isTeacher, signInTeacher, signOutTeacher } from '@/lib/auth'
import {
  createActivity,
  deleteActivity,
  updateActivity,
  type ActivityInput,
} from '@/lib/activities'
import { isValidSection } from '@/lib/constants'
import type { Block } from '@/lib/types'

export type LoginState = { error?: string }

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get('password') ?? '')
  const ok = await signInTeacher(password)
  if (!ok) return { error: 'Mot de passe incorrect.' }
  redirect('/enseignant/tableau')
}

export async function logoutAction(): Promise<void> {
  await signOutTeacher()
  redirect('/enseignant')
}

export type SaveResult = { ok: boolean; error?: string }

type SavePayload = {
  id?: number
  grade: number
  section: string
  title: string
  description: string
  blocks: Block[]
}

function revalidateFor(grade: number, section: string) {
  revalidatePath('/enseignant/tableau')
  revalidatePath(`/niveau/${grade}`)
  revalidatePath(`/niveau/${grade}/${section}`)
}

export async function saveActivityAction(
  payload: SavePayload,
): Promise<SaveResult> {
  if (!(await isTeacher())) return { ok: false, error: 'Non autorisé.' }

  const title = payload.title.trim()
  if (!title) return { ok: false, error: 'Le titre est obligatoire.' }
  if (!Number.isInteger(payload.grade) || payload.grade < 1 || payload.grade > 6) {
    return { ok: false, error: 'Année invalide.' }
  }
  if (!isValidSection(payload.section)) {
    return { ok: false, error: 'Section invalide.' }
  }

  const input: ActivityInput = {
    grade: payload.grade,
    section: payload.section,
    title,
    description: payload.description.trim() || null,
    blocks: payload.blocks,
  }

  try {
    if (payload.id) {
      await updateActivity(payload.id, input)
    } else {
      await createActivity(input)
    }
  } catch (error) {
    console.error('[v0] saveActivityAction error:', error)
    return { ok: false, error: "Erreur lors de l'enregistrement." }
  }

  revalidateFor(payload.grade, payload.section)
  return { ok: true }
}

export async function deleteActivityAction(
  id: number,
  grade: number,
  section: string,
): Promise<SaveResult> {
  if (!(await isTeacher())) return { ok: false, error: 'Non autorisé.' }
  try {
    await deleteActivity(id)
  } catch (error) {
    console.error('[v0] deleteActivityAction error:', error)
    return { ok: false, error: 'Erreur lors de la suppression.' }
  }
  revalidateFor(grade, section)
  return { ok: true }
}
