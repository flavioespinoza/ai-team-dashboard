# AI Team Dashboard

An Internal Team Dashboard with AI Assistant built for a coding challenge. This application allows team members to ask questions to an AI assistant, view conversation history, and save valuable Q&A pairs to a searchable knowledge base.

## Features Implemented

✅ **AI Assistant Chat Interface**

- Real-time conversation with AI assistant powered by OpenAI GPT-4o-mini
- Text input with "Ask" button
- Display conversation messages (user questions + AI answers)
- Loading state during AI response generation
- Markdown rendering for formatted answers
- "Save to Knowledge Base" button on each AI response

✅ **Knowledge Base Sidebar**

- Display all saved Q&A pairs
- Question as title with answer preview
- Click to expand/collapse full Q&A
- Search/filter functionality across questions, answers, and tags
- Pin favorite Q&A items (pinned items appear at top)
- Delete saved items with confirmation
- Empty state when no items saved
- Sorted by most recent with pinned items first

✅ **Data Persistence**

- MongoDB database with Mongoose ODM
- Collection: `knowledge_base`
- Schema: \_id, question, answer, tags, isPinned, createdAt, updatedAt
- All data persists across sessions

✅ **AI Integration**

- OpenAI API with GPT-4o-mini model
- Server Actions for API calls (not API routes)
- Proper error handling and validation with Zod
- Environment variables for API keys

✅ **Additional Features**

- Responsive design (mobile and desktop)
- Pin/unpin Q&A items
- Search functionality in knowledge base
- Keyboard shortcuts (Enter to submit, Shift+Enter for new line)
- Auto-scroll to new messages
- Smooth transitions and animations
- Loading states throughout
- Error boundaries and user feedback

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Jotai (atom-based, React 19 compatible)
- **Database**: MongoDB with Mongoose
- **AI API**: OpenAI API (GPT-4o-mini)
- **Markdown**: react-markdown
- **Code Formatting**: Prettier with custom configuration
- **Package Manager**: yarn (npm also supported)

## Project Structure

```
ai-team-dashboard/
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server Actions for AI and DB operations
│   │   ├── layout.tsx          # Root layout with Jotai Provider
│   │   ├── page.tsx            # Main dashboard page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── button.tsx      # Button component
│   │   │   ├── input.tsx       # Input and Textarea components
│   │   │   ├── card.tsx        # Card components
│   │   │   ├── badge.tsx       # Badge component for tags
│   │   │   └── scroll-area.tsx # Scrollable container
│   │   ├── chat-interface.tsx  # Main chat interface
│   │   ├── message.tsx         # Individual message component
│   │   ├── knowledge-base-sidebar.tsx  # Knowledge base list
│   │   ├── knowledge-base-item.tsx     # Individual KB item
│   │   └── providers.tsx       # Jotai provider wrapper
│   ├── db/
│   │   ├── schema.ts           # Mongoose schema
│   │   └── index.ts            # MongoDB connection
│   ├── state/
│   │   ├── atoms.ts            # Jotai atoms
│   │   └── selectors.ts        # Jotai derived atoms
│   ├── types/
│   │   └── global.d.ts         # TypeScript global types
│   └── lib/
│       └── utils.ts            # Helper functions (cn utility)
├── .prettierrc                 # Prettier configuration
├── .env.example                # Environment variables template
├── .env.local                  # Environment variables (gitignored)
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and yarn (or npm)
- MongoDB Atlas account (free tier available)
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/flavioespinoza/ai-team-dashboard.git
cd ai-team-dashboard
```

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

### 3. Set Up MongoDB Atlas

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (free tier available)
3. Create a database user with username/password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"
6. The connection string format:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database_name>?retryWrites=true&w=majority
   ```

### 4. Get OpenAI API Key

1. Create an account at https://platform.openai.com
2. Navigate to API Keys: https://platform.openai.com/api-keys
3. Create a new API key
4. Copy the key (you won't be able to see it again)

### 5. Configure Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your actual credentials:

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-...your-actual-key...

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_team_dashboard?retryWrites=true&w=majority
MONGODB_DB=ai_team_dashboard
```

### 6. Run the Development Server

```bash
yarn dev
# or
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
yarn dev             # Start development server (or: npm run dev)
yarn build           # Build for production (or: npm run build)
yarn start           # Start production server (or: npm start)
yarn lint            # Run ESLint (or: npm run lint)
yarn clean           # Format code with Prettier (or: npm run clean)
```

## Code Style

This project follows strict code style rules enforced by Prettier:

- **NO SEMICOLONS** in TypeScript/JavaScript files
- **TABS** for indentation (not spaces)
- **Single quotes** for strings
- **No trailing commas**
- **Arrow function params** always wrapped in parentheses
- **Max line length**: 100 characters

Run `yarn clean` (or `npm run clean`) to format all code according to these rules.

## Design Decisions & Architecture

### Why Jotai for State Management?

Jotai was chosen over Redux, Context API, or Recoil for several reasons:

- **React 19 compatibility**: Full support for React 19 (Recoil has compatibility issues)
- **Minimal boilerplate**: Simple atom-based state definition with no keys required
- **Excellent TypeScript support**: Type-safe state management out of the box
- **Granular updates**: Components only re-render when their specific atoms change
- **Computed values**: Derived atoms for computed state (sorted, filtered lists)
- **Smaller bundle size**: More lightweight than Recoil
- **React-first**: Designed specifically for React with hooks
- **Better performance**: Optimized for modern React features

### Server Actions vs API Routes

Server Actions were chosen over traditional API routes because:

- **Simplified data flow**: Direct function calls from client components
- **Better TypeScript integration**: End-to-end type safety
- **Reduced boilerplate**: No need to define routes, handle HTTP methods
- **Built-in security**: Automatic CSRF protection
- **Progressive enhancement**: Forms work without JavaScript

### Component Structure

The component architecture follows atomic design principles:

1. **UI Primitives** (`components/ui/`): Reusable, unstyled components
2. **Feature Components** (`components/`): Business logic components
3. **Page Components** (`app/page.tsx`): Layout and orchestration

### MongoDB Schema Design

The knowledge base schema is simple but extensible:

- `question` and `answer`: Core Q&A content
- `tags`: Array for categorization (future feature)
- `isPinned`: Boolean for user-prioritized items
- `timestamps`: Automatic createdAt/updatedAt tracking

The schema uses Mongoose for:

- Type validation
- Default values
- Automatic timestamp management
- Easy queries with built-in methods

## Usage Guide

### Asking Questions

1. Type your question in the textarea at the bottom of the chat interface
2. Press Enter or click "Ask" to send
3. Wait for the AI assistant to respond (you'll see a "Thinking..." indicator)
4. The answer will appear in the chat with markdown formatting

### Saving to Knowledge Base

1. After receiving an AI response, click the "Save to Knowledge Base" button on that message
2. The Q&A pair will be automatically saved to the knowledge base
3. The saved item will appear in the sidebar (or below on mobile)

### Managing Knowledge Base

- **Search**: Use the search box to filter by question, answer, or tags
- **Pin**: Click the pin icon (📍) to pin important items to the top
- **Expand**: Click "Show more" to see the full answer
- **Delete**: Click the trash icon (🗑️) to remove an item (requires confirmation)

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message

## Testing Checklist

✅ Can ask a question and receive AI response
✅ Messages display in conversation list
✅ Can save AI answer to knowledge base
✅ Saved items appear in sidebar
✅ Can click saved item to view full Q&A
✅ Can delete saved items
✅ Can pin/unpin items
✅ Search functionality works
✅ Loading states work correctly
✅ Error handling works (invalid API key, network errors)
✅ Responsive design works on mobile
✅ Database persists across page refreshes

## Development Time

**Total Time**: ~4-5 hours

- **Phase 1** (Project Setup): 30-45 min
- **Phase 2** (Server Actions & API): 45-60 min
- **Phase 3** (State Management): 30 min
- **Phase 4** (Component Library): 45-60 min
- **Phase 5** (Dashboard Components): 60-90 min
- **Phase 6** (Main Layout): 30-45 min
- **Phase 7** (Polish & Testing): 30 min

## Known Limitations

- No user authentication (single user application)
- No real-time collaboration features
- No file upload or image support
- Search is client-side only (not optimized for large datasets)
- No pagination (all items loaded at once)

## Future Enhancements

- [ ] Add user authentication and multi-user support
- [ ] Implement tagging system for Q&A pairs
- [ ] Add export functionality (JSON, CSV, Markdown)
- [ ] Implement server-side search and pagination
- [ ] Add content moderation and keyword filtering
- [ ] Support for file attachments and images
- [ ] Real-time collaboration with WebSockets
- [ ] Analytics dashboard (usage metrics, popular questions)
- [ ] AI model selection (GPT-4, GPT-3.5, Claude)
- [ ] Conversation threading and history
- [ ] Custom system prompts per conversation
- [ ] Knowledge base categories and folders

## Troubleshooting

### "Failed to get response from AI assistant"

- Check that `OPENAI_API_KEY` is set correctly in `.env.local`
- Verify your OpenAI API key is valid and has credits
- Check your internet connection

### "Failed to load knowledge base"

- Verify `MONGODB_URI` and `MONGODB_DB` are set in `.env.local`
- Check that your MongoDB cluster is running
- Verify your IP address is whitelisted in MongoDB Atlas
- Check database user credentials

### Build Errors

- Run `yarn install` (or `npm install`) to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `rm -rf .next && yarn build`
- Check for TypeScript errors: `yarn build`

### Formatting Issues

- Run `yarn clean` (or `npm run clean`) to format all code with Prettier
- Check that `.prettierrc` exists in the project root

## License

This project is created for a coding challenge and is available for educational purposes.

## How This Project Was Built

This project was built using **Claude Code**, Anthropic's official CLI tool for Claude. The entire implementation process was guided by a comprehensive AI prompt that defined the architecture, tech stack, and implementation phases.

### Build Process

- **Tool**: Claude Code (Anthropic's AI-powered development assistant)
- **Development Time**: ~4-5 hours
- **Methodology**: Phase-by-phase implementation following a structured prompt
- **Original Prompt**: Available in [`docs/ai-prompt.md`](./docs/ai-prompt.md)

The prompt document includes detailed implementation instructions, code style requirements, and phase-by-phase development guidelines that were used to build this application from scratch.

## Contributing

This is a coding challenge project. For questions or feedback, please contact the project author.

---

Built with ❤️ using Next.js 15, React 19, TypeScript, Tailwind CSS 4, Jotai, MongoDB, and OpenAI API.
