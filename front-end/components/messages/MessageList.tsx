import { useEffect, useRef, useState } from "react";
import MessageService from "../../services/MessageService";
import { Message } from "@types";

interface MessageListProps {
  groupId?: number;
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ groupId, messages }) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const fetchedMessages = await MessageService.getAllMessages(groupId);
      setLocalMessages(fetchedMessages);
      setError(null);

      // Initialize last timestamp
      if (fetchedMessages.length > 0) {
        const lastMessageTimestamp = new Date(fetchedMessages[fetchedMessages.length - 1].timestamp).toISOString();
        setLastTimestamp(lastMessageTimestamp);
      } else {
        setLastTimestamp(null); // No messages yet
      }
    } catch (err) {
      setError("Failed to load messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessages = (newMessages: Message[]) => {
    if (newMessages.length > 0) {
      const lastMessageTimestamp = new Date(newMessages[newMessages.length - 1].timestamp).toISOString();
      setLastTimestamp(lastMessageTimestamp);

      const uniqueNewMessages = newMessages.filter(
        (newMessage) => !localMessages.some((message) => message.id === newMessage.id)
      );
      setLocalMessages((prevMessages) => [...prevMessages, ...uniqueNewMessages]);
    }
  };

  const fetchNewMessages = () => {
    if (!groupId) return;

    if (!lastTimestamp) {
      // If no `lastTimestamp`, fetch all messages again (initial scenario)
      fetchMessages();
    } else {
      // Otherwise, fetch only new messages
      MessageService.getNewMessages(groupId, lastTimestamp, handleNewMessages);
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!groupId) return;

    fetchMessages(); // Initial fetch of messages

    const interval = setInterval(() => {
      fetchNewMessages(); // Poll for new messages every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount or groupId change
  }, [groupId, lastTimestamp]); // Depend on groupId and lastTimestamp

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom whenever messages are updated
  }, [localMessages]);

  if (loading) return <div className="text-center text-gray-500">Loading messages...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div ref={containerRef} className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 shadow-md">
      {localMessages.length === 0 ? (
        <div className="text-center text-gray-500">No messages found.</div>
      ) : (
        localMessages.map((message) => (
          <div
            key={`${message.id}-${message.timestamp}`}
            className="mb-4 p-3 bg-white rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-700">
              <strong className="text-blue-600">{message.user.nickname}</strong>: {message.message}
            </p>
            <small className="text-gray-400">{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
