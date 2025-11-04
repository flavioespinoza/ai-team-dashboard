// Date: 2025-11-04
// Version: 1.0.0

'use client'

import { useState } from 'react'
import { knowledgeBaseState } from '@/state/atoms'
import { sortedWithPinnedFirstSelector } from '@/state/selectors'
import { useRecoilValue } from 'recoil'
import { KnowledgeBaseItemComponent } from './knowledge-base-item'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

export function KnowledgeBaseSidebar() {
	const knowledgeBaseItems = useRecoilValue(sortedWithPinnedFirstSelector)
	const [searchQuery, setSearchQuery] = useState('')

	// Filter items based on search query
	const filteredItems = knowledgeBaseItems.filter((item) => {
		const query = searchQuery.toLowerCase()
		return (
			item.question.toLowerCase().includes(query) ||
			item.answer.toLowerCase().includes(query) ||
			item.tags?.some((tag) => tag.toLowerCase().includes(query))
		)
	})

	return (
		<Card className="flex h-full flex-col">
			<CardHeader>
				<CardTitle>Knowledge Base</CardTitle>
				<Input
					type="text"
					placeholder="Search knowledge base..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="mt-2"
				/>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col overflow-hidden">
				<ScrollArea className="flex-1 pr-4">
					<div className="flex flex-col gap-4">
						{filteredItems.length === 0 ? (
							<div className="flex h-full items-center justify-center text-center text-gray-500">
								<p>
									{searchQuery
										? 'No items found matching your search'
										: 'No saved items yet. Save answers from the chat to build your knowledge base.'}
								</p>
							</div>
						) : (
							filteredItems.map((item) => <KnowledgeBaseItemComponent key={item._id} item={item} />)
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	)
}
