// Date: 2025-11-04
// Version: 1.1.0

'use server'

import { connectDB } from '@/db'
import { IKnowledgeBase, KnowledgeBase } from '@/db/schema'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

// Validation schemas
const questionSchema = z.string().min(1, 'Question cannot be empty').max(2000)
const tagsSchema = z.array(z.string()).optional()

type ServerActionResponse<T = unknown> = {
	success: boolean
	data?: T
	error?: string
}

/**
 * Ask the AI assistant a question
 */
export async function askAssistant(question: string): Promise<ServerActionResponse<string>> {
	try {
		// Validate input
		const validatedQuestion = questionSchema.parse(question)

		// Call OpenAI API
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful AI assistant for an internal team. Provide clear, concise, and actionable answers.'
				},
				{
					role: 'user',
					content: validatedQuestion
				}
			],
			temperature: 0.7,
			max_tokens: 1000
		})

		const answer = completion.choices[0]?.message?.content || ''

		if (!answer) {
			throw new Error('No response from AI assistant')
		}

		return {
			success: true,
			data: answer
		}
	} catch (error) {
		console.error('Error in askAssistant:', error)

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || 'Invalid question format'
			}
		}

		if (error instanceof Error) {
			return {
				success: false,
				error: error.message
			}
		}

		return {
			success: false,
			error: 'Failed to get response from AI assistant'
		}
	}
}

/**
 * Save a Q&A pair to the knowledge base
 */
export async function saveToKnowledgeBase(
	question: string,
	answer: string,
	tags?: string[]
): Promise<ServerActionResponse<IKnowledgeBase>> {
	try {
		// Validate inputs
		const validatedQuestion = questionSchema.parse(question)
		const validatedAnswer = z.string().min(1).parse(answer)
		const validatedTags = tagsSchema.parse(tags)

		// Connect to database
		await connectDB()

		// Create new knowledge base entry
		const entry = await KnowledgeBase.create({
			question: validatedQuestion,
			answer: validatedAnswer,
			tags: validatedTags || [],
			isPinned: false
		})

		// Convert to plain object
		const plainEntry = entry.toObject() as IKnowledgeBase
		plainEntry._id = entry._id.toString()

		return {
			success: true,
			data: plainEntry
		}
	} catch (error) {
		console.error('Error in saveToKnowledgeBase:', error)

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || 'Invalid input format'
			}
		}

		if (error instanceof Error) {
			return {
				success: false,
				error: error.message
			}
		}

		return {
			success: false,
			error: 'Failed to save to knowledge base'
		}
	}
}

/**
 * Get all knowledge base entries
 */
export async function getKnowledgeBase(): Promise<ServerActionResponse<IKnowledgeBase[]>> {
	try {
		// Connect to database
		await connectDB()

		// Fetch all entries, sorted by most recent first
		const entries = await KnowledgeBase.find().sort({ createdAt: -1 }).lean().exec()

		// Convert ObjectId to string
		const plainEntries = entries.map((entry) => ({
			...entry,
			_id: entry._id?.toString() || ''
		})) as unknown as IKnowledgeBase[]

		return {
			success: true,
			data: plainEntries
		}
	} catch (error) {
		console.error('Error in getKnowledgeBase:', error)

		if (error instanceof Error) {
			return {
				success: false,
				error: error.message
			}
		}

		return {
			success: false,
			error: 'Failed to fetch knowledge base'
		}
	}
}

/**
 * Delete a knowledge base entry by ID
 */
export async function deleteKnowledgeBaseItem(id: string): Promise<ServerActionResponse<void>> {
	try {
		// Validate ID
		const validatedId = z.string().min(1).parse(id)

		// Connect to database
		await connectDB()

		// Delete the entry
		const result = await KnowledgeBase.findByIdAndDelete(validatedId)

		if (!result) {
			throw new Error('Knowledge base item not found')
		}

		return {
			success: true
		}
	} catch (error) {
		console.error('Error in deleteKnowledgeBaseItem:', error)

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: 'Invalid ID format'
			}
		}

		if (error instanceof Error) {
			return {
				success: false,
				error: error.message
			}
		}

		return {
			success: false,
			error: 'Failed to delete knowledge base item'
		}
	}
}

/**
 * Toggle the pinned status of a knowledge base entry
 */
export async function togglePinItem(id: string): Promise<ServerActionResponse<IKnowledgeBase>> {
	try {
		// Validate ID
		const validatedId = z.string().min(1).parse(id)

		// Connect to database
		await connectDB()

		// Find the entry
		const entry = await KnowledgeBase.findById(validatedId)

		if (!entry) {
			throw new Error('Knowledge base item not found')
		}

		// Toggle isPinned
		entry.isPinned = !entry.isPinned
		await entry.save()

		// Convert to plain object
		const plainEntry = entry.toObject() as IKnowledgeBase
		plainEntry._id = entry._id.toString()

		return {
			success: true,
			data: plainEntry
		}
	} catch (error) {
		console.error('Error in togglePinItem:', error)

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: 'Invalid ID format'
			}
		}

		if (error instanceof Error) {
			return {
				success: false,
				error: error.message
			}
		}

		return {
			success: false,
			error: 'Failed to toggle pin status'
		}
	}
}