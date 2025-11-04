// Date: 2025-11-04
// Version: 1.0.0
import { atom } from 'recoil'

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

export const messagesState = atom<Message[]>({
	key: 'messagesState',
	default: []
})

export const knowledgeBaseState = atom<KnowledgeBaseItem[]>({
	key: 'knowledgeBaseState',
	default: []
})

export const isLoadingState = atom<boolean>({
	key: 'isLoadingState',
	default: false
})

export const selectedKnowledgeItemState = atom<KnowledgeBaseItem | null>({
	key: 'selectedKnowledgeItemState',
	default: null
})
