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

  const fetchMessages = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const fetchedMessages = await MessageService.getAllMessages(groupId);
      setMessages(fetchedMessages);
      setError(null);
    } catch (err) {
      setError("Failed to load messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(); 

    if (!groupId) return;

    const eventSource = MessageService.getMessagesStream(groupId);

    eventSource.onmessage = (event) => {
      try {
        const newMessages: Message[] = JSON.parse(event.data);

        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      } catch (parseError) {
        console.error("Error parsing SSE data:", parseError);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error with SSE connection:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [groupId]);

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
