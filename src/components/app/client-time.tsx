import { useEffect, useState } from 'react'

/** Renders times only after hydration so server (UTC) and browser timezones never disagree. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

function relative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
  const days = Math.floor(diff / 86400)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}

export function ClientTime({ iso, mode = 'relative' }: { iso: string; mode?: 'relative' | 'datetime' | 'time' | 'date' }) {
  const hydrated = useHydrated()
  if (!hydrated) return <span className="inline-block h-3 w-14 animate-pulse rounded bg-navy-100 align-middle" />
  const d = new Date(iso)
  const text =
    mode === 'relative'
      ? relative(iso)
      : mode === 'time'
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : mode === 'date'
          ? d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
          : d.toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  return (
    <time dateTime={iso} title={d.toLocaleString()}>
      {text}
    </time>
  )
}
