import { MessageInput } from '../types';
import { Message } from '../model/message';
import messageDb from '../repository/message.db';
import UserService from '../service/user.service';
import GroupService from '../service/group.service';

const createMessage = async (messageData: MessageInput): Promise<Message> => {
    try {
        console.log('Received message data:', messageData);

        if (!messageData.user?.id) {
            console.error('User ID is required.');
            throw new Error('User ID is required.');
        }
        console.log('messageData group:', messageData.group);
        if (!messageData.group?.id) {
            console.error('Group ID is required.');
            throw new Error('Group ID is required.');
        }
        console.log('Message content:', messageData.message);
        if (!messageData.message) {
            console.error('Message content is required');
            throw new Error('Message content is required');
        }

        console.log(`Fetching user with ID: ${messageData.user.id}`);
        const user = await UserService.getUserById(messageData.user.id);
        if (!user) {
            console.error('A valid user is required.');
            throw new Error('A valid user is required.');
        }

        console.log(`Fetching group with ID: ${messageData.group.id}`);
        const group = await GroupService.getGroupById(messageData.group.id);
        if (!group) {
            console.error('A valid group is required.');
            throw new Error('A valid group is required.');
        }

        console.log('Creating new message:', {
            user,
            group,
            timestamp: messageData.timestamp,
            message: messageData.message,
        });

        const newMessage = new Message({
            user,
            group,
            timestamp: messageData.timestamp,
            message: messageData.message,
        });

        const createdMessage = await messageDb.createMessage(newMessage);
        console.log('Created message:', createdMessage);
        return createdMessage;
    } catch (error) {
        console.error('Error during message creation:', error);
        throw error;  
    }
};

const getMessageById = async (id: number): Promise<Message | null> => {
    console.log(`Fetching message by ID: ${id}`);
    return await messageDb.getMessageById(id);
};

const getAllMessages = async (groupId?: number): Promise<Message[]> => {
    console.log('Fetching all messages for group ID:', groupId);
    return await messageDb.getAllMessages(groupId);
};

const getNewMessages = async (groupId: number, lastTimestamp: string): Promise<Message[]> => {
    console.log(`Fetching new messages for group ID ${groupId} after ${lastTimestamp}`);
    return await messageDb.getNewMessages(groupId, lastTimestamp);
};


export default { createMessage, getMessageById, getAllMessages,getNewMessages };
