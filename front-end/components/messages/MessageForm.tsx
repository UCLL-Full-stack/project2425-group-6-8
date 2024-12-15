import { useState } from "react";
import MessageService from "../../services/MessageService"; 

const MessageForm: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      await MessageService.createMessage({
        groupId,
        message, 
      });

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        rows={4}
        className="w-full"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;
