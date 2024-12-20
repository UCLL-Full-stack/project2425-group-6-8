import React from "react";
import MessageList from "@components/messages/MessageList";
import MessageForm from "@components/messages/MessageForm";

interface MessageSectionProps {
  groupId: number;
  messages: any[];
  onMessageSent: (newMessages: any[]) => void;
}

const MessageSection: React.FC<MessageSectionProps> = ({ groupId, messages, onMessageSent }) => {
  return (
    <div className="flex-grow p-4 bg-gray-50 flex flex-col">
      <div>
        <MessageList groupId={groupId} messages={messages} />
      </div>
      <div className="sticky bottom-0 w-full bg-white shadow-lg p-4">
        <MessageForm groupId={groupId} onMessageSent={onMessageSent} />
      </div>
    </div>
  );
};

export default MessageSection;
