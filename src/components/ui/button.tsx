// Date: 2025-11-04
// Version: 1.0.0
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'ghost' | 'outline'
	size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', size = 'md', ...props }, ref) => {
		return (
			<button
				className={cn(
					'inline-flex items-center justify-center rounded-md font-medium transition-colors',
					'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
					'disabled:pointer-events-none disabled:opacity-50',
					{
						// Variants
						'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600':
							variant === 'default',
						'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100':
							variant === 'ghost',
						'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800':
							variant === 'outline',
						// Sizes
						'h-8 px-3 text-sm': size === 'sm',
						'h-10 px-4 text-base': size === 'md',
						'h-12 px-6 text-lg': size === 'lg'
					},
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)

Button.displayName = 'Button'

export { Button }
