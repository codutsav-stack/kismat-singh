import * as React from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800',
  navy: 'bg-navy-900 text-white shadow-sm hover:bg-navy-800',
  outline: 'border border-navy-200 bg-white text-navy-800 hover:bg-navy-50 hover:border-navy-300',
  ghost: 'text-navy-700 hover:bg-navy-100',
  subtle: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
}
const sizes = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-7 text-base gap-2.5',
  icon: 'h-10 w-10',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function buttonClass(variant: keyof typeof variants = 'primary', size: keyof typeof sizes = 'md', className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-xl font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    variants[variant],
    sizes[size],
    className,
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />
  ),
)
Button.displayName = 'Button'
