import { useState } from "react";
import MessageService from "../../services/MessageService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

interface MessageFormProps {
  groupId: number;
  onMessageSent: (newMessages: any[]) => void;  
}

const MessageForm: React.FC<MessageFormProps> = ({ groupId, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const { t } = useTranslation("common");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newMessage = await MessageService.createMessage({
        groupId,
        message,
      });

      onMessageSent([newMessage]); 
      setMessage(""); 
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Type your message"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
        {t('message.send')}
      </button>
    </form>
  );
};

export default MessageForm;
