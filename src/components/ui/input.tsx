// Date: 2025-11-04
// Version: 1.0.0
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
				'focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100',
				className
			)}
			ref={ref}
			{...props}
		/>
	)
})

Input.displayName = 'Input'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
	return (
		<textarea
			className={cn(
				'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
				'focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100',
				className
			)}
			ref={ref}
			{...props}
		/>
	)
})

Textarea.displayName = 'Textarea'

export { Input, Textarea }
