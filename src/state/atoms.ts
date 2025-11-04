// Date: 2025-11-04
// Version: 1.0.0
import { atom } from 'jotai'

export type Message = {
	id: string
	type: 'user' | 'assistant'
	content: string
	timestamp: Date
}

export type KnowledgeBaseItem = {
	_id: string
	question: string
	answer: string
	tags?: string[]
	isPinned: boolean
	createdAt: Date
	updatedAt: Date
}

export const messagesState = atom<Message[]>([])

export const knowledgeBaseState = atom<KnowledgeBaseItem[]>([])

export const isLoadingState = atom<boolean>(false)

export const selectedKnowledgeItemState = atom<KnowledgeBaseItem | null>(null)
