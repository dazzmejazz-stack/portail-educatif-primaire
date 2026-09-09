import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-base font-semibold text-card-foreground shadow-sm ring-1 ring-border transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
    >
      <ArrowLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      {label}
    </Link>
  )
}
