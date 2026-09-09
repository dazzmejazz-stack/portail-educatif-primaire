export type SectionSlug = 'interpreter' | 'inventer' | 'apprecier'

export type GradeConfig = {
  n: number
  label: string
  sub: string
  color: string
}

export const GRADES: GradeConfig[] = [
  { n: 1, label: '1re', sub: 'année', color: '#F0555F' },
  { n: 2, label: '2e', sub: 'année', color: '#F97316' },
  { n: 3, label: '3e', sub: 'année', color: '#E0A400' },
  { n: 4, label: '4e', sub: 'année', color: '#2FA24A' },
  { n: 5, label: '5e', sub: 'année', color: '#2AA9C4' },
  { n: 6, label: '6e', sub: 'année', color: '#6C50E0' },
]

export type SectionConfig = {
  slug: SectionSlug
  label: string
  tagline: string
  icon: 'Mic2' | 'Sparkles' | 'Ear'
  color: string
}

export const SECTIONS: SectionConfig[] = [
  {
    slug: 'interpreter',
    label: 'Interpréter',
    tagline: 'Je chante et je joue',
    icon: 'Mic2',
    color: '#E8590C',
  },
  {
    slug: 'inventer',
    label: 'Inventer',
    tagline: "J'invente de la musique",
    icon: 'Sparkles',
    color: '#7048E8',
  },
  {
    slug: 'apprecier',
    label: 'Apprécier',
    tagline: "J'écoute et je découvre",
    icon: 'Ear',
    color: '#1098AD',
  },
]

export function getGrade(n: number): GradeConfig | undefined {
  return GRADES.find((g) => g.n === n)
}

export function getSection(slug: string): SectionConfig | undefined {
  return SECTIONS.find((s) => s.slug === slug)
}

export function isValidSection(slug: string): slug is SectionSlug {
  return SECTIONS.some((s) => s.slug === slug)
}
