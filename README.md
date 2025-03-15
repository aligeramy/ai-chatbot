<a href="https://projecthub.ai/">
  <img alt="Project Hub AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Project Hub AI Chatbot</h1>
</a>

<p align="center">
  An Intelligent AI Chatbot Platform Built With Next.js and the AI SDK.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#key-components"><strong>Key Components</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenAI (default), Anthropic, Cohere, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
  - Simple and secure authentication

## Architecture

Project Hub follows a modern Next.js application architecture with the following structure:

```
/app                   # Next.js App Router pages and layouts
  /(auth)              # Authentication-related routes
  /(chat)              # Chat interface routes
    /api               # API routes for chat functionality
    /chat              # Chat-specific pages
  /layout.tsx          # Root layout component
  /globals.css         # Global CSS styles

/components            # Reusable React components
  /ui                  # UI components (buttons, inputs, etc.)
  /chat-header.tsx     # Chat interface header
  /app-sidebar.tsx     # Application sidebar
  /icons.tsx           # SVG icons used throughout the app
  # ... other components

/lib                   # Utility functions and shared code
/public                # Static assets
/hooks                 # Custom React hooks
```

### Data Flow

The application uses a combination of client and server components to manage data flow:

1. **Server Components**: Handle data fetching and initial rendering
   - Key files: `app/(chat)/page.tsx`, `app/(chat)/layout.tsx`

2. **Client Components**: Manage interactivity and state
   - Key files: `components/chat.tsx`, `components/messages.tsx`

3. **API Routes**: Process requests and interact with AI models
   - Key files: `app/(chat)/api/chat/route.ts`

## Key Components

### Core Components

#### App Layout (`app/layout.tsx`)
Defines the base HTML structure with theme support:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://projecthub.ai'),
  title: 'Project Hub',
  description: 'Project Hub AI chatbot powered by the AI SDK.',
};

// ... Theme color handling and layout structure
```

#### Chat Component (`components/chat.tsx`)
The main chat interface that integrates with the AI SDK:

```typescript
export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: ChatProps) {
  // Integration with AI SDK hooks
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      id,
      initialMessages,
      body: { selectedChatModel },
      api: '/api/chat',
      // ... other configuration
    });
  
  // ... UI rendering and event handlers
}
```

#### App Sidebar (`components/app-sidebar.tsx`)
Navigation and history sidebar:

```typescript
export function AppSidebar({ user }: { user: User | undefined }) {
  // ... 
  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link href="/">
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Project Hub
              </span>
            </Link>
            {/* ... */}
          </div>
        </SidebarMenu>
      </SidebarHeader>
      {/* ... */}
    </Sidebar>
  );
}
```

### AI Integration

#### Chat API Route (`app/(chat)/api/chat/route.ts`)
Processes chat requests and integrates with the AI model:

```typescript
export async function POST(req: Request) {
  const { messages, selectedChatModel } = await req.json();
  
  // Create a data stream response for real-time streaming
  return createDataStreamResponse({
    execute: async dataStream => {
      const result = streamText({
        model: getModel(selectedChatModel),
        messages,
        tools: {
          // Tool integrations go here
        },
      });
      
      result.mergeIntoDataStream(dataStream);
    },
  });
}
```

#### Tool Integration
The application supports AI tools for extending capabilities:

```typescript
// Example tool implementation
getWeatherInformation: tool({
  description: 'show the weather in a given city to the user',
  parameters: z.object({ city: z.string() }),
  execute: async ({ city }) => {
    // Implementation logic
    return `The weather in ${city} is ...`;
  },
}),
```

### User Interface

#### Messages Component (`components/messages.tsx`)
Renders the chat messages with support for different content types:

```typescript
export function Messages({
  messages,
  isLoading,
  // ...
}: MessagesProps) {
  return (
    <div className="messages-container">
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          // ...
        />
      ))}
      {/* Loading indicators and other UI elements */}
    </div>
  );
}
```

#### Message Actions (`components/message-actions.tsx`)
Provides interactive controls for each message:

```typescript
export function MessageActions({
  message,
  // ...
}: MessageActionsProps) {
  return (
    <div className="message-actions">
      {/* Copy, edit, and other action buttons */}
    </div>
  );
}
```

## Model Providers

This platform ships with OpenAI `gpt-4o` as the default. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

### Model Configuration (`lib/ai/models.ts`)
Defines available models and their configurations:

```typescript
export const DEFAULT_CHAT_MODEL = 'gpt-4o';

export const chatModelProviders = {
  'gpt-4o': {
    provider: 'openai',
    model: 'gpt-4o',
    // ... configuration
  },
  'claude-3-opus': {
    provider: 'anthropic',
    model: 'claude-3-opus',
    // ... configuration
  },
  // ... other models
};
```

## Deploy Your Own

You can deploy your own version of the Project Hub AI Chatbot with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=Project%20Hub%20AI%20Chatbot&demo-description=An%20Intelligent%20AI%20Chatbot%20Platform%20Built%20With%20Next.js%20and%20the%20AI%20SDK.&demo-url=https%3A%2F%2Fprojecthub.ai&stores=[{%22type%22:%22postgres%22},{%22type%22:%22blob%22}])

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Project Hub AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Advanced Features

### File Handling
Upload and process files with AI analysis:

```typescript
// File upload handler in app/(chat)/api/files/upload/route.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  // Upload to blob storage
  const blob = await put(`chat/${uuid}.${extension}`, file, {
    access: 'public',
  });
  
  return NextResponse.json({ url: blob.url });
}
```

### Human-in-the-Loop Tool Confirmation
Support for user confirmation before executing AI tool calls:

```typescript
// In tool definition
{
  getWeatherInformation: tool({
    description: '...',
    parameters: z.object({ city: z.string() }),
    // Without execute function -> requires confirmation
  }),
}

// On the client
{toolInvocation.state === 'call' && (
  <div>
    <p>Confirm action: {toolInvocation.toolName}?</p>
    <button onClick={() => addToolResult({
      toolCallId,
      result: APPROVAL.YES,
    })}>
      Yes
    </button>
    <button onClick={() => addToolResult({
      toolCallId,
      result: APPROVAL.NO,
    })}>
      No
    </button>
  </div>
)}
```

### Multi-modal Input
Support for different input types including text, files, and structured data:

```typescript
// In components/multimodal-input.tsx
export function MultimodalInput({
  onSubmit,
  // ...
}: MultimodalInputProps) {
  // Handle different input types (text, files, etc.)
  
  return (
    <div className="input-container">
      {/* Text input, file upload buttons, etc. */}
    </div>
  );
}
```
