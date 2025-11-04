// Date: 2025-11-04
// Version: 1.0.0
import { selector } from 'recoil'
import { knowledgeBaseState } from './atoms'

// Filter pinned items
export const pinnedItemsSelector = selector({
	key: 'pinnedItemsSelector',
	get: ({ get }) => {
		const items = get(knowledgeBaseState)
		return items.filter((item) => item.isPinned)
	}
})

// Sort by date (most recent first)
export const sortedKnowledgeBaseSelector = selector({
	key: 'sortedKnowledgeBaseSelector',
	get: ({ get }) => {
		const items = get(knowledgeBaseState)
		return [...items].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
	}
})

// Sort with pinned items first, then by date
export const sortedWithPinnedFirstSelector = selector({
	key: 'sortedWithPinnedFirstSelector',
	get: ({ get }) => {
		const items = get(knowledgeBaseState)
		return [...items].sort((a, b) => {
			// Pinned items come first
			if (a.isPinned && !b.isPinned) return -1
			if (!a.isPinned && b.isPinned) return 1
			// Within same pin status, sort by date
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		})
	}
})
