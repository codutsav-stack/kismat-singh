import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const field =
  'w-full rounded-xl border border-navy-200 bg-white px-3.5 text-[15px] text-navy-900 placeholder:text-navy-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 aria-invalid:border-red-400 aria-invalid:ring-red-500/10 disabled:bg-navy-50'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(field, 'h-11', className)} {...props} />,
)
Input.displayName = 'Input'

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <span className="relative block">
      <select ref={ref} className={cn(field, 'h-11 cursor-pointer appearance-none pr-10', className)} {...props} />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
    </span>
  ),
)
Select.displayName = 'Select'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-navy-800', className)} {...props} />
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1.5 text-sm text-red-600">{children}</p>
}
