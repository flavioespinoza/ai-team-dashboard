// Date: 2025-11-04
// Version: 1.0.0
import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
	return (
		<div
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
				{
					'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100': variant === 'default',
					'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100': variant === 'secondary',
					'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100':
						variant === 'success',
					'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100':
						variant === 'warning',
					'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100': variant === 'destructive'
				},
				className
			)}
			{...props}
		/>
	)
}

export { Badge }
