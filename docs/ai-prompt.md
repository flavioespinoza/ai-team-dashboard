# AI Team Dashboard - Claude Code Implementation Prompt

## Project Overview
Build an Internal Team Dashboard with AI Assistant for a coding challenge. This is a Next.js 15+ application with React 19, TypeScript, and Tailwind CSS 4. The app allows team members to ask questions to an AI assistant, view conversation history, and save valuable Q&A pairs to a searchable knowledge base.

**Time Budget:** 4-6 focused hours for core features
**Stack:** Next.js 15+, React 19, TypeScript, Tailwind CSS 4, Recoil.js, MongoDB, Mongoose, OpenAI API
**Package Manager:** Yarn

## Core Requirements

### 1. AI Assistant Chat Interface
- Text input with "Ask Assistant" button
- Display conversation messages (user questions + AI answers)
- Show loading state during AI response generation
- Real-time message display as they're added
- Each message should have a "Save to Knowledge Base" button

### 2. Knowledge Base Sidebar
- Display all saved Q&A pairs
- Show question as title, answer preview
- Click to view full Q&A
- Optional: tags/categories for organization
- Optional: search/filter functionality

### 3. Data Persistence
- Store all Q&A pairs in MongoDB database
- Collection: `knowledge_base`
- Schema: _id (ObjectId), question (string), answer (string), tags (array of strings, optional), createdAt (Date), isPinned (boolean, default false)
- Use Mongoose for schema definition and queries

### 4. AI Integration
- Use OpenAI API (GPT-4 or GPT-4o-mini)
- Server Actions for API calls (not API routes)
- Proper error handling and rate limiting consideration
- Environment variable for API key

## Implementation Order

### Phase 1: Project Setup - Prettier & MongoDB (30-45 min)

#### 1.1 Install Prettier and Plugins
```bash
yarn add -D prettier @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss
```

#### 1.2 Create `.prettierrc` file at project root:
```json
{
	"arrowParens": "always",
	"useTabs": true,
	"tabWidth": 2,
	"singleQuote": true,
	"trailingComma": "none",
	"semi": false,
	"printWidth": 100,
	"importOrderSeparation": false,
	"importOrderSortSpecifiers": true,
	"importOrderGroupNamespaceSpecifiers": true,
	"importOrderParserPlugins": ["typescript", "jsx", "decorators-legacy"],
	"importOrder": [
		"^react$",
		"^react-dom$",
		"^react",
		"^next",
		"<THIRD_PARTY_MODULES>",
		"^@blockless/(.*)$",
		"^[./]"
	],
	"plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
}
```

#### 1.3 Add Prettier script to `package.json`:
```json
{
  "scripts": {
    "clean": "prettier --write ."
  }
}
```

#### 1.4 Install MongoDB dependencies:
```bash
yarn add mongoose
```

#### 1.5 Create `.env.example` file:
```bash
# OpenAI API Key
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=<your_openai_api_key>

# MongoDB Configuration
# Set up your database at: https://www.mongodb.com/cloud/atlas/register
# MongoDB connection string
MONGODB_URI=mongodb+srv://<your_database_username>:<your_database_password>@cluster.mongodb.net/<your_database_name>?retryWrites=true&w=majority
# MongoDB database name
MONGODB_DB=<your_database_name>
```

#### 1.6 Create `.env.local` (gitignored) with actual values

#### 1.7 Create MongoDB schema at `src/db/schema.ts`:
```typescript
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
	mongoose.models.KnowledgeBase ||
	mongoose.model('KnowledgeBase', KnowledgeBaseSchema)

export type IKnowledgeBase = {
	_id: string
	question: string
	answer: string
	tags?: string[]
	isPinned: boolean
	createdAt: Date
	updatedAt: Date
}
```

#### 1.8 Create database connection at `src/db/index.ts`:
```typescript
// Date: 2025-11-04
// Version: 1.0.0

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = process.env.MONGODB_DB!

if (!MONGODB_URI) {
	throw new Error('Please define MONGODB_URI environment variable')
}

if (!MONGODB_DB) {
	throw new Error('Please define MONGODB_DB environment variable')
}

let cached = global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				dbName: MONGODB_DB,
				bufferCommands: false
			})
			.then((mongoose) => mongoose)
	}

	try {
		cached.conn = await cached.promise
	} catch (e) {
		cached.promise = null
		throw e
	}

	return cached.conn
}
```

#### 1.9 Add TypeScript global types at `src/types/global.d.ts`:
```typescript
// Date: 2025-11-04
// Version: 1.0.0

declare global {
	var mongoose: {
		conn: typeof import('mongoose') | null
		promise: Promise<typeof import('mongoose')> | null
	}
}

export {}
```

### Phase 2: Server Actions & API Integration (45-60 min)

#### 2.1 Install OpenAI SDK:
```bash
yarn add openai zod
```

#### 2.2 Create Server Actions at `src/app/actions.ts`:

**Actions to implement:**
- `askAssistant(question: string)` - calls OpenAI API, returns answer
- `saveToKnowledgeBase(question: string, answer: string, tags?: string[])` - saves Q&A to MongoDB
- `getKnowledgeBase()` - retrieves all saved Q&A pairs from MongoDB
- `deleteKnowledgeBaseItem(id: string)` - removes saved item by MongoDB _id
- `togglePinItem(id: string)` - toggles isPinned status (bonus feature)

**Implementation requirements:**
- Use Zod for input validation
- Proper error handling with try/catch
- Return structured responses: `{ success: boolean, data?: any, error?: string }`
- Import and call `connectDB()` before each database operation
- Use Mongoose models for all database queries

**Example structure:**
```typescript
'use server'

import { connectDB } from '@/db'
import { KnowledgeBase } from '@/db/schema'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

export async function askAssistant(question: string) {
	try {
		// Validation
		// OpenAI API call
		// Return response
	} catch (error) {
		// Error handling
	}
}

export async function saveToKnowledgeBase(
	question: string,
	answer: string,
	tags?: string[]
) {
	try {
		await connectDB()
		// Create document
		// Return result
	} catch (error) {
		// Error handling
	}
}

// Additional actions...
```

#### 2.3 OpenAI Integration Details:
- Model: `gpt-4o-mini` (cost-effective) or `gpt-4` (higher quality)
- System prompt: `"You are a helpful AI assistant for an internal team. Provide clear, concise, and actionable answers."`
- Temperature: `0.7`
- Max tokens: `1000`

### Phase 3: State Management with Recoil (30 min)

#### 3.1 Install Recoil:
```bash
yarn add recoil
```

#### 3.2 Setup Recoil Root in `src/app/layout.tsx`:
- Wrap children with `<RecoilRoot>`
- Add `'use client'` directive to layout file
- Keep existing Geist fonts and metadata

#### 3.3 Create Recoil atoms at `src/state/atoms.ts`:
```typescript
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
```

#### 3.4 Create Recoil selectors at `src/state/selectors.ts` (optional, for bonus features):
```typescript
// Date: 2025-11-04
// Version: 1.0.0

import { selector } from 'recoil'
import { knowledgeBaseState } from './atoms'

// Example: Filter pinned items
export const pinnedItemsSelector = selector({
	key: 'pinnedItemsSelector',
	get: ({ get }) => {
		const items = get(knowledgeBaseState)
		return items.filter((item) => item.isPinned)
	}
})

// Example: Sort by date
export const sortedKnowledgeBaseSelector = selector({
	key: 'sortedKnowledgeBaseSelector',
	get: ({ get }) => {
		const items = get(knowledgeBaseState)
		return [...items].sort((a, b) => 
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
	}
})
```

### Phase 4: Component Library (45-60 min)
Create reusable components following shadcn/ui pattern but custom-built:

1. `src/components/ui/button.tsx`:
   - Variants: default, ghost, outline
   - Sizes: sm, md, lg
   - TypeScript props with proper typing
   - Tailwind CSS styling

2. `src/components/ui/input.tsx`:
   - Standard text input
   - Textarea variant
   - Focus states and accessibility

3. `src/components/ui/card.tsx`:
   - Container component
   - CardHeader, CardContent, CardFooter sub-components

4. `src/components/ui/badge.tsx`:
   - For tags/categories
   - Color variants

5. `src/components/ui/scroll-area.tsx`:
   - Custom scrollable container
   - For message list and knowledge base

### Phase 5: Main Dashboard Components (60-90 min)
1. `src/components/message.tsx`:
   - Display single message (user or assistant)
   - Show timestamp
   - "Save to Knowledge Base" button for assistant messages
   - Markdown rendering for formatted answers (install react-markdown if needed)

2. `src/components/chat-interface.tsx`:
   - Textarea for user input
   - "Ask Assistant" button
   - Message list with scroll-to-bottom on new message
   - Loading indicator
   - Auto-focus input after submit
   - Handle form submission

3. `src/components/knowledge-base-sidebar.tsx`:
   - List of saved Q&A items
   - Click to expand/view full answer
   - Delete button per item
   - Empty state when no items saved
   - Optional: search input (bonus)
   - Optional: tag filters (bonus)

4. `src/components/knowledge-base-item.tsx`:
   - Individual saved Q&A display
   - Question as title
   - Answer preview (truncated)
   - Tags display (if implemented)
   - Click to expand/collapse
   - Delete action

### Phase 6: Main Dashboard Layout (30-45 min)
1. Update `src/app/page.tsx`:
   - 'use client' directive
   - Two-column layout: chat interface (main) + knowledge base sidebar
   - Responsive: stack vertically on mobile
   - Recoil hooks to manage state
   - useEffect to load knowledge base on mount
   - Handle all user interactions

2. Update `src/app/layout.tsx`:
   - Update metadata: title "AI Team Dashboard", description
   - Keep Geist fonts
   - Ensure RecoilRoot wraps children

### Phase 7: Polish & Error Handling (30 min)
1. Error boundaries and user feedback:
   - Toast notifications or inline error messages
   - Handle OpenAI API errors gracefully
   - Handle database errors
   - Loading states everywhere needed

2. UX improvements:
   - Smooth transitions
   - Optimistic UI updates
   - Clear empty states
   - Keyboard shortcuts (Enter to submit)
   - Auto-scroll to new messages

3. Accessibility:
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management

## Code Style Requirements (CRITICAL)

### Prettier Configuration
Follow these exact settings from .prettierrc:
```json
{
  "arrowParens": "always",
  "useTabs": true,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false,
  "printWidth": 100
}
```

### Key Rules:
- **NO SEMICOLONS** in TypeScript/JavaScript files
- Use TABS (not spaces) for indentation
- Single quotes for strings
- No trailing commas
- Arrow function params always wrapped in parentheses
- Max line length: 100 characters

### File Headers:
Every code file must include:
```typescript
// Date: 2025-11-04
// Version: 1.0.0
```

## Bonus Features (If Time Permits)
- Search functionality in knowledge base
- Tag/category system for saved Q&A
- Pin favorite Q&A items
- Edit saved answers
- Export knowledge base to JSON/CSV
- Simple content moderation (keyword filtering)
- Dark mode support

## MongoDB Setup
1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (free tier available)
3. Create a database user with username/password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Add connection string to `.env.local`
7. No migrations needed - MongoDB is schemaless, collections are created automatically

## Package Manager Commands
All commands use yarn:
```bash
yarn install          # Install dependencies
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn clean            # Format code with Prettier
```

## Environment Variables

Create `.env.example`:
```bash
# OpenAI API Key
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=<your_openai_api_key>

# MongoDB Configuration
# Set up your database at: https://www.mongodb.com/cloud/atlas/register
# MongoDB connection string
MONGODB_URI=mongodb+srv://<your_database_username>:<your_database_password>@cluster.mongodb.net/<your_database_name>?retryWrites=true&w=majority
# MongoDB database name
MONGODB_DB=<your_database_name>
```

Create `.env.local` (gitignored) with your actual values.

## Expected File Structure After Implementation
```
ai-team-dashboard/
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server Actions
│   │   ├── layout.tsx          # Root layout with RecoilRoot
│   │   ├── page.tsx            # Main dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Reusable primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── scroll-area.tsx
│   │   ├── chat-interface.tsx
│   │   ├── message.tsx
│   │   ├── knowledge-base-sidebar.tsx
│   │   └── knowledge-base-item.tsx
│   ├── db/
│   │   ├── schema.ts           # Mongoose schema
│   │   └── index.ts            # MongoDB connection
│   ├── state/
│   │   ├── atoms.ts            # Recoil atoms
│   │   └── selectors.ts        # Recoil selectors (optional)
│   ├── types/
│   │   └── global.d.ts         # TypeScript global types
│   └── lib/
│       └── utils.ts            # Helper functions (cn, etc.)
├── .prettierrc                 # Prettier configuration
├── .env.example                # Environment variables template
├── .env.local                  # Environment variables (gitignored)
└── README.md
```

## Testing Checklist
- [x] Can ask a question and receive AI response
- [x] Messages display in conversation list
- [x] Can save AI answer to knowledge base
- [x] Saved items appear in sidebar
- [x] Can click saved item to view full Q&A
- [x] Can delete saved items
- [x] Loading states work correctly
- [x] Error handling works (try invalid API key)
- [x] Responsive design works on mobile
- [x] Database persists across page refreshes on localhost
- [ ] Database persists across page refreshes on production

## README Requirements
Include in README.md:
1. Project overview
2. Setup instructions:
   - Clone repository
   - Run `yarn install`
   - Setup MongoDB Atlas account
   - Copy `.env.example` to `.env.local`
   - Add MongoDB URI and OpenAI API key
3. How to run:
   - Development: `yarn dev`
   - Production: `yarn build && yarn start`
   - Format code: `yarn clean`
4. Features implemented (list with checkmarks)
5. Tech stack:
   - Next.js 15+, React 19, TypeScript
   - Tailwind CSS 4
   - Recoil.js for state management
   - MongoDB with Mongoose
   - OpenAI API (GPT-4o-mini)
6. Time spent (start/end timestamps, total hours)
7. Bonus features (if any)
8. Design decisions and architecture notes:
   - Why Recoil for state management
   - Server Actions vs API routes
   - Component structure decisions
   - MongoDB schema design

## Success Criteria
- Clean, typed, well-structured code
- Working AI integration with proper error handling
- Data persistence across sessions
- Good UX with loading states and feedback
- Responsive design
- Clear documentation
- No hardcoded secrets
- Follows all code style requirements (NO SEMICOLONS!)

## Implementation Notes
- Focus on core functionality first
- Keep components simple and reusable
- Use TypeScript strictly (no `any` types unless absolutely necessary)
- Prioritize working features over visual polish
- Test each phase before moving to next
- Commit frequently with clear messages
- **IMPORTANT:** Run `yarn clean` after completing each phase to format all code with Prettier
- All code must follow the Prettier configuration (no semicolons, tabs, single quotes)

Start with Phase 1 and work sequentially. The order is optimized for minimal blockers and maximum progress. Good luck!