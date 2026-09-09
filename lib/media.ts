export function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host.endsWith('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return url
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      if (u.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`
      }
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }
    return null
  } catch {
    return null
  }
}

export function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
}
