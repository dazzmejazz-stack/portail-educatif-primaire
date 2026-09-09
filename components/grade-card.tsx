import Link from 'next/link'
import type { GradeConfig } from '@/lib/constants'

export function GradeCard({ grade }: { grade: GradeConfig }) {
  return (
    <Link
      href={`/niveau/${grade.n}`}
      className="group relative flex aspect-square flex-col items-center justify-center rounded-3xl p-4 text-white shadow-lg transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ backgroundColor: grade.color }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-white/0 transition-colors duration-150 group-hover:bg-white/10"
      />
      <span className="font-display text-6xl font-extrabold leading-none drop-shadow-sm sm:text-7xl">
        {grade.label}
      </span>
      <span className="mt-1 font-display text-xl font-semibold sm:text-2xl">
        {grade.sub}
      </span>
    </Link>
  )
}
