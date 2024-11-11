import { MessageInput } from '../types';
import { Message } from '../model/message';
import messageDb from '../repository/message.db';
import UserService from '../service/user.service';

const createMessage = (messageData: MessageInput): Message => {
    if (!messageData.user?.id) throw new Error('User ID is required');
    const user = UserService.getUserById(messageData.user.id);
    if (!user) throw new Error('A valid user is required');

    const newMessage = new Message({
        user,
        timestamp: messageData.timestamp || new Date().toISOString(),
        message: messageData.message,
    });

    messageDb.createMessage(newMessage);
    return newMessage;
};

const getMessageById = (id: number): Message | undefined => {
    return messageDb.getMessageById(id);
};

const getAllMessages = (): Message[] => {
    return messageDb.getAllMessages();
};

export default { createMessage, getMessageById, getAllMessages };
