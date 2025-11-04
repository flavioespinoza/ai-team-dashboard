// Date: 2025-11-04
// Version: 1.0.0

'use client'

import { useEffect, useState } from 'react'
import { getKnowledgeBase } from '@/app/actions'
import { ChatInterface } from '@/components/chat-interface'
import { KnowledgeBaseSidebar } from '@/components/knowledge-base-sidebar'
import { knowledgeBaseState } from '@/state/atoms'
import { useSetAtom } from 'jotai'

export default function Home() {
	const setKnowledgeBase = useSetAtom(knowledgeBaseState)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Load knowledge base on mount
	useEffect(() => {
		async function loadKnowledgeBase() {
			try {
				const result = await getKnowledgeBase()

				if (result.success && result.data) {
					setKnowledgeBase(result.data)
				} else {
					setError(result.error || 'Failed to load knowledge base')
				}
			} catch (err) {
				console.error('Error loading knowledge base:', err)
				setError('Failed to load knowledge base')
			} finally {
				setIsLoading(false)
			}
		}

		loadKnowledgeBase()
	}, [setKnowledgeBase])

	return (
		<div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
			{/* Header */}
			<header className="border-b border-gray-200 card rounded-none!">
				<div className="container mx-auto px-10 py-4">
					<h1 className="text-2xl font-bold text-gray-900">AI Team Dashboard</h1>
					<p className="text-sm text-gray-600">Ask questions and build your knowledge base</p>
				</div>
			</header>

			{/* Main content */}
			<main className="container mx-auto flex flex-1 gap-4 overflow-hidden p-4">
				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<div className="text-center">
							<div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
							<p className="text-gray-600">Loading...</p>
						</div>
					</div>
				) : error ? (
					<div className="flex flex-1 items-center justify-center">
						<div className="rounded-lg bg-red-50 p-4 text-red-800">
							<p className="font-semibold">Error</p>
							<p className="text-sm">{error}</p>
						</div>
					</div>
				) : (
					<>
						{/* Chat Interface - Main area */}
						<div className="flex flex-1 flex-col overflow-hidden lg:w-2/3">
							<ChatInterface />
						</div>

						{/* Knowledge Base Sidebar */}
						<div className="hidden w-full overflow-hidden lg:block lg:w-1/3">
							<KnowledgeBaseSidebar />
						</div>
					</>
				)}
			</main>

			{/* Mobile Knowledge Base - Shows as separate section on mobile */}
			<div className="container mx-auto block px-4 pb-4 lg:hidden">
				<KnowledgeBaseSidebar />
			</div>
		</div>
	)
}
