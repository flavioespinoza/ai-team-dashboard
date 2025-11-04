// Date: 2025-11-04
// Version: 1.2.0

'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { askAssistant } from '@/app/actions'
import { MessageComponent } from '@/components/message'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { messagesState } from '@/state/atoms'
import { useAtom } from 'jotai'
import { MessageSquarePlus } from 'lucide-react'

export function ChatInterface() {
	const [messages, setMessages] = useAtom(messagesState)
	const [question, setQuestion] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (scrollRef.current) {
			const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
			if (scrollElement) {
				scrollElement.scrollTop = scrollElement.scrollHeight
			}
		}
	}, [messages])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!question.trim() || isSubmitting) {
			return
		}

		setError(null)
		setIsSubmitting(true)

		// Add user message
		const userMessage = {
			id: Date.now().toString(),
			type: 'user' as const,
			content: question.trim(),
			timestamp: new Date()
		}

		setMessages((prev) => [...prev, userMessage])
		setQuestion('')

		try {
			// Call AI assistant
			const result = await askAssistant(userMessage.content)

			if (result.success && result.data) {
				// Add assistant message
				const assistantMessage = {
					id: (Date.now() + 1).toString(),
					type: 'assistant' as const,
					content: result.data,
					timestamp: new Date()
				}

				setMessages((prev) => [...prev, assistantMessage])
			} else {
				setError(result.error || 'Failed to get response from AI assistant')
			}
		} catch (err) {
			setError('An unexpected error occurred')
			console.error('Error asking assistant:', err)
		} finally {
			setIsSubmitting(false)
			// Focus back on textarea
			textareaRef.current?.focus()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e)
		}
	}

	const handleNewChat = () => {
		setMessages([])
		setQuestion('')
		setError(null)
		textareaRef.current?.focus()
	}

	return (
		<Card className="flex h-full flex-col">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>AI Assistant</CardTitle>
					<Button
						variant="secondary"
						size="sm"
						onClick={handleNewChat}
						disabled={messages.length === 0}
						className="gap-2"
					>
						<MessageSquarePlus className="h-4 w-4" />
						New Chat
					</Button>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
				{/* Messages area */}
				<ScrollArea ref={scrollRef} className="flex-1 pr-4">
					<div className="flex flex-col gap-4">
						{messages.length === 0 ? (
							<div className="flex h-full items-center justify-center text-gray-500">
								<p>Ask a question to get started</p>
							</div>
						) : (
							messages.map((message, index) => (
								<MessageComponent
									key={message.id}
									message={message}
									previousMessage={index > 0 ? messages[index - 1] : undefined}
								/>
							))
						)}
						{isSubmitting && (
							<div className="flex justify-start">
								<div className="max-w-[80%] rounded-lg bg-[var(--surface)] bg-gray-100 p-4 text-gray-900">
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 animate-pulse rounded-full bg-gray-600"></div>
										<div className="animation-delay-200 h-2 w-2 animate-pulse rounded-full bg-gray-600"></div>
										<div className="animation-delay-400 h-2 w-2 animate-pulse rounded-full bg-gray-600"></div>
										<span className="ml-2 text-sm">Thinking...</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</ScrollArea>

				{/* Error message */}
				{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

				{/* Input area */}
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Textarea
						ref={textareaRef}
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Ask a question... (Press Enter to send, Shift+Enter for new line)"
						className="min-h-[80px] resize-none"
						disabled={isSubmitting}
					/>
					<Button
						variant="primary"
						type="submit"
						disabled={!question.trim() || isSubmitting}
						className="self-end"
					>
						{isSubmitting ? 'Sending...' : 'Ask'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
