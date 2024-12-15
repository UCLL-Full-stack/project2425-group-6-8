import { useEffect, useState } from "react";
import MessageService from "../../services/MessageService";
import { Message } from "@types"; 

interface MessageListProps {
  groupId?: number;
}

const MessageList: React.FC<MessageListProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch messages
  const fetchMessages = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const fetchedMessages = await MessageService.getAllMessages(groupId);
      setMessages(fetchedMessages);
      setError(null); // Clear previous errors
    } catch (err) {
      setError("Failed to load messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start polling when the component mounts
  useEffect(() => {
    fetchMessages(); // Initial fetch

    const interval = setInterval(() => {
      fetchMessages(); // Polling every 5 seconds (adjust as needed)
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [groupId]); // Depend on groupId to refetch messages when it changes

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div>No messages found.</div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="message-item">
            <p>
              <strong>{message.user.name}</strong>: {message.message}
            </p>
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
