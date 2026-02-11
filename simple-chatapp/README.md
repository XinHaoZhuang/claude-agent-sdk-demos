# Simple Chat App

A demo chat application using the Claude Agent SDK with a React frontend and Express backend.

![Architecture Diagram](diagram.png)

## Features

### Multi-User Support

This application supports multiple users accessing and conversing simultaneously:

- **Automatic User Identification**: Each WebSocket connection is automatically assigned a unique user ID and username (e.g., `User-abc12345`)
- **User Distinction**: Messages display the username of who sent them, making it easy to distinguish between different users
- **Customizable Usernames**: Users can change their display name by clicking "Edit" in the user info section (bottom of the sidebar)
- **Shared Chat Sessions**: Multiple users can join the same chat and see each other's messages in real-time
- **Real-time Updates**: All connected users receive messages instantly via WebSocket

#### How Multi-User Works

1. When a user connects, the server automatically generates:
   - A unique `userId` (UUID) for tracking the connection
   - A default `username` (e.g., `User-abc12345`)

2. Users can customize their username:
   - Click "Edit" next to the username in the sidebar
   - Enter a new username
   - The new username will appear with all future messages

3. Multiple users can chat in the same session:
   - All users subscribed to a chat see messages from all participants
   - Each message shows who sent it
   - The AI assistant responds to messages from any user

## Getting Started

### Prerequisites

- Node.js 18+
- Claude Agent SDK credentials (set `ANTHROPIC_API_KEY` environment variable)

### Installation

```bash
npm install
```

### Running

```bash
npm run dev
```

This starts both:
- **Backend** (Express + WebSocket) on http://localhost:3001
- **Frontend** (Vite + React) on http://localhost:5173

Open http://localhost:5173 in your browser.

## Production Considerations

This is an example app for demonstration purposes. For production use, consider:

1. **Isolate the Agent SDK** - Move the SDK into a separate container/service. This provides better security isolation since the agent has access to tools like Bash, file system operations, and web requests.

2. **Persistent storage** - Replace the in-memory `ChatStore` with a database. Currently all chats are lost on server restart.

3. **Transcript syncing** - For Agent Sessions to be persisted across server restarts, you'll need to persist and restore the SDK's conversation transcripts. The SDK maintains internal state for multi-turn conversations that must be synced with your storage.

4. **Authentication** - Add proper user authentication and authorization. Currently, user identification is based on WebSocket connections without secure authentication. For production:
   - Implement proper login/authentication (OAuth, JWT, etc.)
   - Associate user IDs with authenticated accounts
   - Add authorization checks to control who can access which chats
   - Store user information in a persistent database

## Demo

![Demo](demo.gif)