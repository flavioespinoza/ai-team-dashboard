// Date: 2025-11-04
// Version: 1.1.0 — switched to DeleteConfirmDialog

'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { deleteKnowledgeBaseItem, togglePinItem } from '@/app/actions'
import { type KnowledgeBaseItem, knowledgeBaseState } from '@/state/atoms'
import { useSetAtom } from 'jotai'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import DeleteConfirmDialog from './ui/delete-confirm-dialog' // ✅ import your dialog

interface KnowledgeBaseItemProps {
	item: KnowledgeBaseItem
}

export function KnowledgeBaseItemComponent({ item }: KnowledgeBaseItemProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isTogglingPin, setIsTogglingPin] = useState(false)
	const setKnowledgeBase = useSetAtom(knowledgeBaseState)

	// ✅ Wrapped delete logic (no built-in confirm)
	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			const result = await deleteKnowledgeBaseItem(item._id)
			if (result.success) {
				setKnowledgeBase((prev) => prev.filter((i) => i._id !== item._id))
			}
		} catch (error) {
			console.error('Error deleting item:', error)
		} finally {
			setIsDeleting(false)
		}
	}

	const handleTogglePin = async () => {
		setIsTogglingPin(true)
		try {
			const result = await togglePinItem(item._id)
			if (result.success && result.data) {
				setKnowledgeBase((prev) =>
					prev.map((i) =>
						i._id === item._id ? { ...i, isPinned: result.data!.isPinned } : i
					)
				)
			}
		} catch (error) {
			console.error('Error toggling pin:', error)
		} finally {
			setIsTogglingPin(false)
		}
	}

	const answerPreview =
		item.answer.length > 150 ? `${item.answer.slice(0, 150)}...` : item.answer

	const createdAt = new Date(item.createdAt).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	})

	return (
		<Card className="transition-shadow hover:shadow-md">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="line-clamp-2 text-base">{item.question}</CardTitle>
					<div className="flex gap-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={handleTogglePin}
							disabled={isTogglingPin}
							className="h-8 w-8 p-0"
						>
							{item.isPinned ? '📌' : '📍'}
						</Button>

						{/* ✅ DeleteConfirmDialog replaces confirm() */}
						<DeleteConfirmDialog
							onConfirm={handleDelete}
							title="Delete Knowledge Base Item?"
							description={`Are you sure you want to delete “${item.question}”? This action cannot be undone.`}
							trigger={
								<Button
									size="sm"
									variant="ghost"
									disabled={isDeleting}
									className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
								>
									🗑️
								</Button>
							}
						/>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					{item.isPinned && <Badge variant="warning">Pinned</Badge>}
					{item.tags?.map((tag) => (
						<Badge key={tag} variant="secondary">
							{tag}
						</Badge>
					))}
				</div>
			</CardHeader>

			<CardContent>
				<div className="mb-2">
					{isExpanded ? (
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
							{item.answer}
						</ReactMarkdown>
					) : (
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{answerPreview}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-500">{createdAt}</span>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? 'Show less' : 'Show more'}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
