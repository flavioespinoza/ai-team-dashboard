// Date: 2025-11-04
// Version: 1.2.0

'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { saveToKnowledgeBase } from '@/app/actions'
import { type Message, knowledgeBaseState } from '@/state/atoms'
import { useSetAtom } from 'jotai'
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
					isUser ? 'bg-tertiary-200 text-tertiary-900' : 'bg-primary-200 text-primary-900'
				}`}
			>
				<div className="mb-2">
					<ReactMarkdown
						components={{
							p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
							code: ({ className, children, ...props }: any) => {
								const match = /language-(\w+)/.exec(className || '')
								const language = match ? match[1] : null
								const inline = !language

								if (!inline && language) {
									return (
										<SyntaxHighlighter
											style={vscDarkPlus}
											language={language}
											PreTag="div"
											customStyle={{
												margin: '0.5rem 0',
												borderRadius: '0.375rem',
												fontSize: '0.875rem'
											}}
											{...props}
										>
											{String(children).replace(/\n$/, '')}
										</SyntaxHighlighter>
									)
								}

								return (
									<code
										className={`rounded px-1 py-0.5 text-sm ${
											isUser ? 'bg-blue-700' : 'bg-gray-200'
										}`}
										{...props}
									>
										{children}
									</code>
								)
							}
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
							variant="outline"
							onClick={handleSave}
							disabled={isSaving || saved}
							className="bg-gray-100/75 text-xs hover:bg-white hover:text-gray-900"
						>
							{saved ? 'Saved' : isSaving ? 'Saving...' : 'Save to Knowledge Base'}
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
