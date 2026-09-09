import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { isTeacher } from '@/lib/auth'

const MAX_BYTES = 50 * 1024 * 1024 // 50 Mo

export async function POST(request: NextRequest) {
  if (!(await isTeacher())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 50 Mo)' },
        { status: 400 },
      )
    }

    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url, name: file.name })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: "Échec du téléversement" }, { status: 500 })
  }
}
