import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('h-8 w-8', className)} aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-navy-900" />
      <circle cx="12.5" cy="16" r="5.5" fill="none" stroke="#72c9c3" strokeWidth="2.4" />
      <circle cx="19.5" cy="16" r="5.5" fill="none" stroke="#fff" strokeWidth="2.4" />
      <path d="M17.2 16.2l1.6 1.6 3.2-3.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className={cn('text-[17px] font-bold tracking-tight', tone === 'dark' ? 'text-navy-900' : 'text-white')}>
        Medi<span className="text-brand-500">Second</span>
      </span>
    </span>
  )
}
