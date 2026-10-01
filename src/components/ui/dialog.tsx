import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button aria-label="Close dialog" className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal
        aria-labelledby="dialog-title"
        tabIndex={-1}
        className={cn(
          'relative max-h-[90vh] w-full animate-fade-in overflow-auto rounded-t-3xl bg-white p-6 shadow-lift focus:outline-none sm:max-w-md sm:rounded-3xl',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold text-navy-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-navy-500">{description}</p>}
          </div>
          <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-navy-500 hover:bg-navy-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children && <div className="mt-5">{children}</div>}
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  )
}
