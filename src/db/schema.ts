// Date: 2025-11-04
// Version: 1.0.0
import mongoose from 'mongoose'

const KnowledgeBaseSchema = new mongoose.Schema(
	{
		question: {
			type: String,
			required: true,
			trim: true
		},
		answer: {
			type: String,
			required: true
		},
		tags: {
			type: [String],
			default: []
		},
		isPinned: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
)

export const KnowledgeBase =
	mongoose.models.KnowledgeBase || mongoose.model('KnowledgeBase', KnowledgeBaseSchema)

export type IKnowledgeBase = {
	_id: string
	question: string
	answer: string
	tags?: string[]
	isPinned: boolean
	createdAt: Date
	updatedAt: Date
}
