import { MessageInput } from '../types';
import { Message } from '../model/message';
import { User } from '../model';

const messages: Message[] = [];
let messageIdCounter = 1;

const createMessage = (messageData: MessageInput): Message => {
    if (!messageData.message) throw new Error('Message content is required');

    const name = "Dagobert";
    const email = "dagobertduck@gmail.com";
    const nickname = "Dago";

    const user1 = new User({
        name,
        email,
        nickname
    });

    const newMessage = new Message({
        id: messageIdCounter++,
        user: user1, 
        timestamp: messageData.timestamp,
        message: messageData.message,
    });

    messages.push(newMessage);
    return newMessage;
};

const getMessageById = (id: number): Message | undefined => {
    return messages.find(message => message.getId() === id);
};

const getAllMessages = (): Message[] => {
    return messages;
};

export default { createMessage, getMessageById, getAllMessages };
