import { cookies, headers } from 'next/headers'
import { createHash } from 'crypto'

const COOKIE_NAME = 'prof_session'

function expectedToken(): string {
  const pw = process.env.TEACHER_PASSWORD ?? ''
  return createHash('sha256').update(`${pw}::classe-musique`).digest('hex')
}

export async function isTeacher(): Promise<boolean> {
  const store = await cookies()
  const value = store.get(COOKIE_NAME)?.value
  return !!value && value === expectedToken()
}

export async function signInTeacher(password: string): Promise<boolean> {
  const expected = process.env.TEACHER_PASSWORD
  if (!expected || password !== expected) return false

  // Use secure/none in HTTPS (incl. the cross-site preview iframe); fall back to
  // lax/insecure over plain http://localhost so the cookie is not dropped.
  const h = await headers()
  const isHttps = (h.get('x-forwarded-proto') ?? '').includes('https')

  const store = await cookies()
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: isHttps,
   sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return true
}

export async function signOutTeacher(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
