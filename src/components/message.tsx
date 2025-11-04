// Date: 2025-11-04
// Version: 1.0.0

'use client'

import { useState } from 'react'
import { useSetAtom } from 'jotai'
import ReactMarkdown from 'react-markdown'
import { saveToKnowledgeBase } from '@/app/actions'
import { type Message, knowledgeBaseState } from '@/state/atoms'
import { Button } from './ui/button'

interface MessageProps {
	message: Message
	previousMessage?: Message
}

export function MessageComponent({ message, previousMessage }: MessageProps) {
	const [isSaving, setIsSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const setKnowledgeBase = useSetAtom(knowledgeBaseState)

	const handleSave = async () => {
		if (!previousMessage || previousMessage.type !== 'user') {
			return
		}

		setIsSaving(true)
		try {
			const result = await saveToKnowledgeBase(previousMessage.content, message.content)

			if (result.success && result.data) {
				setKnowledgeBase((prev) => [result.data!, ...prev])
				setSaved(true)
			}
		} catch (error) {
			console.error('Error saving to knowledge base:', error)
		} finally {
			setIsSaving(false)
		}
	}

	const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit'
	})

	const isUser = message.type === 'user'

	return (
		<div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[80%] rounded-lg p-4 ${
					isUser
						? 'bg-blue-600 text-white'
						: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
				}`}
			>
				<div className="mb-2">
					<ReactMarkdown
						components={{
							p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
							code: ({ children }) => (
								<code className="rounded bg-gray-200 px-1 py-0.5 text-sm dark:bg-gray-700">
									{children}
								</code>
							),
							pre: ({ children }) => (
								<pre className="my-2 overflow-x-auto rounded bg-gray-200 p-2 dark:bg-gray-700">
									{children}
								</pre>
							)
						}}
					>
						{message.content}
					</ReactMarkdown>
				</div>
				<div className="flex items-center justify-between gap-2">
					<span className="text-xs opacity-70">{timestamp}</span>
					{!isUser && previousMessage && (
						<Button
							size="sm"
							variant="ghost"
							onClick={handleSave}
							disabled={isSaving || saved}
							className="text-xs"
						>
							{saved ? 'Saved' : isSaving ? 'Saving...' : 'Save to KB'}
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}