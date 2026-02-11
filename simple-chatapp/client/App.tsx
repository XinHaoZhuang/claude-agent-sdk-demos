import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "tool_use";
  content: string;
  timestamp: string;
  toolName?: string;
  toolInput?: Record<string, any>;
  userId?: string;
  username?: string;
}

// Use relative URLs - Vite will proxy to the backend
const API_BASE = "/api";
const WS_URL = `ws://${window.location.hostname}:3001/ws`;

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);

  // Handle WebSocket messages
  const handleWSMessage = useCallback((message: any) => {
    switch (message.type) {
      case "connected":
        console.log("Connected to server");
        setUserId(message.userId);
        setUsername(message.username);
        break;

      case "identified":
        console.log("Identified as:", message.username);
        setUsername(message.username);
        break;

      case "history":
        setMessages(message.messages || []);
        break;

      case "user_message":
        // Messages from other users need to be added to the message list
        // (our own messages are already added optimistically)
        if (message.userId !== userId) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "user",
              content: message.content,
              timestamp: new Date().toISOString(),
              userId: message.userId,
              username: message.username,
            },
          ]);
        }
        break;

      case "assistant_message":
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: message.content,
            timestamp: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
        break;

      case "tool_use":
        // Add tool use to messages array so it persists
        // Alternative: To show tool uses only while pending, store them in a
        // separate `pendingToolUses` state and clear it on "assistant_message" or "result"
        setMessages((prev) => [
          ...prev,
          {
            id: message.toolId,
            role: "tool_use",
            content: "",
            timestamp: new Date().toISOString(),
            toolName: message.toolName,
            toolInput: message.toolInput,
          },
        ]);
        break;

      case "result":
        setIsLoading(false);
        // Refresh chat list to get updated titles
        fetchChats();
        break;

      case "error":
        console.error("Server error:", message.error);
        setIsLoading(false);
        break;
    }
  }, []);

  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  const isConnected = readyState === ReadyState.OPEN;

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastJsonMessage) {
      handleWSMessage(lastJsonMessage);
    }
  }, [lastJsonMessage, handleWSMessage]);

  // Fetch all chats
  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_BASE}/chats`);
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  // Create new chat
  const createChat = async () => {
    try {
      const res = await fetch(`${API_BASE}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const chat = await res.json();
      setChats((prev) => [chat, ...prev]);
      selectChat(chat.id);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  // Delete chat
  const deleteChat = async (chatId: string) => {
    try {
      await fetch(`${API_BASE}/chats/${chatId}`, { method: "DELETE" });
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // Select a chat
  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setMessages([]);
    setIsLoading(false);

    // Subscribe to chat via WebSocket
    sendJsonMessage({ type: "subscribe", chatId });
  };

  // Send a message
  const handleSendMessage = (content: string) => {
    if (!selectedChatId || !isConnected) return;

    // Add message optimistically
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        userId: userId || undefined,
        username: username || undefined,
      },
    ]);

    setIsLoading(true);

    // Send via WebSocket
    sendJsonMessage({
      type: "chat",
      content,
      chatId: selectedChatId,
    });
  };

  // Update username
  const handleUpdateUsername = (newUsername: string) => {
    if (newUsername.trim() && isConnected) {
      sendJsonMessage({
        type: "identify",
        username: newUsername.trim(),
      });
      setShowUsernameDialog(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={selectChat}
          onNewChat={createChat}
          onDeleteChat={deleteChat}
        />
        
        {/* User info section */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Logged in as:</div>
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm text-gray-700 truncate">
              {username || "Loading..."}
            </div>
            <button
              onClick={() => setShowUsernameDialog(true)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <ChatWindow
        chatId={selectedChatId}
        messages={messages}
        isConnected={isConnected}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />

      {/* Username dialog */}
      {showUsernameDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Change Username</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem("username") as HTMLInputElement;
                handleUpdateUsername(input.value);
              }}
            >
              <input
                type="text"
                name="username"
                defaultValue={username || ""}
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUsernameDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
