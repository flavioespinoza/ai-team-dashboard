// Date: 2025-11-04
// Version: 1.2.2
import {
	InputHTMLAttributes,
	TextareaHTMLAttributes,
	forwardRef,
	useCallback,
	useEffect,
	useRef
} from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				'flex h-10 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm',
				'focus-visible:ring-primary-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
				'disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			ref={ref}
			{...props}
		/>
	)
})

Input.displayName = 'Input'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const MIN_PX = 40

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
	const innerRef = useRef<HTMLTextAreaElement | null>(null)

	const combinedRef = useCallback(
		(node: HTMLTextAreaElement) => {
			innerRef.current = node
			if (typeof ref === 'function') ref(node)
			else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
		},
		[ref]
	)

	const resize = useCallback(() => {
		const el = innerRef.current
		if (!el) return

		// Reset to auto to measure full content height
		el.style.height = 'auto'

		// Add border widths to scrollHeight when using border-box
		const cs = getComputedStyle(el)
		const borderY = parseFloat(cs.borderTopWidth || '0') + parseFloat(cs.borderBottomWidth || '0')

		const next = Math.max(el.scrollHeight + borderY, MIN_PX)
		el.style.height = `${next}px`
	}, [])

	useEffect(() => {
		resize()
	}, [resize, props.value])

	return (
		<textarea
			ref={combinedRef}
			onInput={resize}
			// Force a single row baseline so initial scrollHeight isn't inflated by default rows
			rows={1}
			className={cn(
				// Start visually at 40px, prevent manual resize/scrollbars, and keep box sizing stable
				'flex min-h-[40px] w-full resize-none overflow-hidden rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm transition-[height] duration-150 ease-in-out',
				'focus-visible:ring-primary-400 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'box-border',
				className
			)}
			// Ensure initial paint is 40px; subsequent effect will keep ≥40px and auto-grow
			style={{ height: `${MIN_PX}px` }}
			{...props}
		/>
	)
})

Textarea.displayName = 'Textarea'

export { Input, Textarea }
