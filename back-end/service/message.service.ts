import { MessageInput } from '../types';
import { Message } from '../model/message';
import { User } from '../model/user';

const messages: Message[] = [];
let messageIdCounter = 1;

const createMessage = (messageData: MessageInput): Message => {
    const name = "Dagobert";
        const email = "dagobertduck@gmail.com";
        const nickname = "Dago";

        const user = new User({
            name,
            email,
            nickname
        });

    if (!messageData.message) throw new Error('Message content is required');
    if (!user) throw new Error('A valid user is required to send a message');

    const timestamp = messageData.timestamp || new Date().toISOString(); //mensen gaan deze zelf ni invullen

    const newMessage = new Message({
        id: messageIdCounter++,
        user,  
        timestamp,
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
