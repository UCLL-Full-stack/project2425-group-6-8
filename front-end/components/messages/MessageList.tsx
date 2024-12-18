import { useEffect, useState } from "react";
import MessageService from "../../services/MessageService";
import { Message } from "@types";

interface MessageListProps {
  groupId?: number;
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ groupId, messages }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const fetchedMessages = await MessageService.getAllMessages(groupId);
      setError(null);
    } catch (err) {
      setError("Failed to load messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessages = (newMessages: Message[]) => {
    messages = [...messages, ...newMessages];
  };

  useEffect(() => {
    if (!groupId) return;

    fetchMessages();

    const startPolling = async () => {
      const stopPolling = await MessageService.getMessagesStream(groupId, handleNewMessages);

      return stopPolling; 
    };

    startPolling().then((stopPolling) => {
      return () => {
        stopPolling(); 
      };
    });

    return () => {
      startPolling().then((stopPolling) => stopPolling());
    };
  }, [groupId]);

  if (loading) return <div className="text-center text-gray-500">Loading messages...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
  <div className="w-full max-w-5xl mx-auto px-4">
  {messages.length === 0 ? (
    <div className="text-center text-gray-500">No messages found.</div>
  ) : (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-700">
            <strong className="text-blue-600">{message.user.nickname}</strong>: {message.message}
          </p>
          <small className="text-gray-400">
            {new Date(message.timestamp).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  )}
</div>


  );
};
export default MessageList;
