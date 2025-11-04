// Date: 2025-11-04
// Version: 2.3.0 — Tailwind v4 tokens aligned (primary=cblue, secondary=hotpink, tertiary=sage)

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-in-out',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          'cursor-pointer select-none',

          // Variants mapped to @theme inline tokens
          {
            // PRIMARY -> cblue (#4c8bab)
            'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500':
              variant === 'primary',

            // SECONDARY -> hotpink (#fe3557)
            'bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500':
              variant === 'secondary',

            // TERTIARY -> sage (#636e5b)
            'bg-tertiary-500 text-white hover:bg-tertiary-600 focus-visible:ring-tertiary-500':
              variant === 'tertiary',

            // DANGER -> same hotpink scale (separate token for semantics)
            'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500':
              variant === 'danger',

            // OUTLINE -> neutral outline
            'border border-gray-300 bg-transparent text-black hover:bg-gray-100 dark:border-gray-700 dark:text-black dark:hover:bg-gray-300':
              variant === 'outline',

            // GHOST -> minimal
            'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800':
              variant === 'ghost'
          },

          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg'
          },

          className
        )}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
