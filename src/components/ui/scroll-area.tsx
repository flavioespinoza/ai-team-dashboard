// Date: 2025-11-04
// Version: 1.0.0
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={cn('relative overflow-auto', className)} {...props}>
				<div className="h-full w-full md:h-[400px]">{children}</div>
			</div>
		)
	}
)

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
