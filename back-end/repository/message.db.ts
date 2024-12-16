import { Message as MessagePrisma, User as UserPrisma, Group as GroupPrisma } from '@prisma/client';
import { Message } from '../model';
import { User } from '../model/user';
import { Group } from '../model/group'; 
import database from './database';

Message.from = function ({
    id,
    user,
    group, 
    timestamp,
    message,
    createdAt,
    updatedAt,
}: MessagePrisma & { user: UserPrisma; group: GroupPrisma }): Message {
    console.log('Message.from service called with data:', {
        id,
        user,
        group, 
        timestamp,
        message,
        createdAt,
        updatedAt,
    });

    return new Message({
        id,
        user: User.from(user),
        group: Group.from(group), 
        timestamp,
        message,
        createdAt,
        updatedAt,
    });
};

const createMessage = async (message: Message): Promise<Message> => {
    try {
        console.log('Creating message:', message);

        const userId = message.getUser().getId();
        const groupId = message.getGroup().getId(); // Get groupId as well
        if (!userId) {
            console.error('User ID is required to create a message');
            throw new Error('User ID is required to create a message');
        }

        if (!groupId) {
            console.error('Group ID is required to create a message');
            throw new Error('Group ID is required to create a message');
        }

        console.log(`Creating message for user ID: ${userId}, group ID: ${groupId}`);

        const messagePrisma = await database.message.create({
            data: {
                userId: userId,
                groupId: groupId, // Include groupId
                timestamp: message.getTimestamp(),
                message: message.getMessage(),
                createdAt: message.getCreatedAt(),
                updatedAt: message.getUpdatedAt(),
            },
            include: {
                user: true,
                group: true, // Include group in the response
            },
        });

        console.log('Message created in database:', messagePrisma);
        return Message.from(messagePrisma); // Use Message.from to create the instance
    } catch (error) {
        console.error('Error creating message:', error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllMessages = async (groupId?: number): Promise<Message[]> => {
    try {
        let messagesPrisma;

        if (groupId) {
            console.log(`Fetching messages for group ID: ${groupId}`);
            messagesPrisma = await database.message.findMany({
                where: { groupId }, 
                include: { user: true, group: true }, // Include both user and group
            });
        } else {
            console.log('Fetching all messages');
            messagesPrisma = await database.message.findMany({
                include: { user: true, group: true }, // Include both user and group
            });
        }

        console.log(`Fetched ${messagesPrisma.length} messages from database`);
        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Database error. See server log for details');
    }
};

const getMessageById = async (id: number): Promise<Message | null> => {
    try {
        console.log(`Fetching message by ID: ${id}`);

        const messagePrisma = await database.message.findUnique({
            where: { id },
            include: { user: true, group: true }, // Include both user and group
        });

        if (!messagePrisma) {
            console.log(`Message with ID ${id} not found`);
            return null;
        }

        console.log(`Fetched message: ${JSON.stringify(messagePrisma)}`);
        return Message.from(messagePrisma); // Use Message.from to create the instance
    } catch (error) {
        console.error('Error fetching message by ID:', error);
        throw new Error('Database error. See server log for details');
    }
};

export default {
    createMessage,
    getAllMessages,
    getMessageById,
};
