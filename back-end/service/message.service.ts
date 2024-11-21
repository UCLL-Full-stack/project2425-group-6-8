import { MessageInput } from '../types';
import { Message } from '../model/message';
import messageDb from '../repository/message.db';
import UserService from '../service/user.service';

const createMessage = async (messageData: MessageInput): Promise<Message> => {
    if (!messageData.user?.id) throw new Error('User ID is required');
    
    const user = await UserService.getUserById(messageData.user.id);
    if (!user) throw new Error('A valid user is required');

    const newMessage = new Message({
        user,
        timestamp: messageData.timestamp,
        message: messageData.message,
    });

    return await messageDb.createMessage(newMessage);
};

const getMessageById = async (id: number): Promise<Message | null> => {
    return await messageDb.getMessageById(id);  
};

const getAllMessages = async (): Promise<Message[]> => {
    return await messageDb.getAllMessages(); 
};

export default { createMessage, getMessageById, getAllMessages };
