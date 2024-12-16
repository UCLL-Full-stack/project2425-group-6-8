import { Message as MessagePrisma, User as UserPrisma, Group as GroupPrisma } from '@prisma/client';
import { Message } from '../model';
import { User } from '../model/user';
import { Group } from '../model/group';
import database from './database';

const prisma = database;
Message.from = function ({
    id,
    user,
    group,
    timestamp,
    message,
    createdAt,
    updatedAt,
}: MessagePrisma & { user: UserPrisma, group: GroupPrisma & { users: UserPrisma[] } }): Message {
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
        console.log('Received message object:', message);

        const user = message.getUser();
        const group = message.getGroup();

        console.log('User object:', user);
        console.log('Group object:', group);

        const userId = user ? user.getId() : null;
        const groupId = group ? group.getId() : null;

        console.log('User ID:', userId);
        console.log('Group ID:', groupId);

        if (!userId) {
            console.error('User ID is required to create a message');
            throw new Error('User ID is required to create a message');
        }

        if (!groupId) {
            console.error('Group ID is required to create a message');
            throw new Error('Group ID is required to create a message');
        }

        console.log(`Creating message for user ID: ${userId} in group ID: ${groupId}`);

        const messagePrisma = await database.message.create({
            data: {
                userId: userId,
                groupId: groupId,
                timestamp: message.getTimestamp(),
                message: message.getMessage(),
                createdAt: message.getCreatedAt(),
                updatedAt: message.getUpdatedAt(),
            },
            include: {
                user: true,
                group: { include: { users: true } },
            },
        });

        console.log('Message created in database:', messagePrisma);

        return Message.from(messagePrisma);
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
                include: {
                    user: true,
                    group: { include: { users: true } },
                },
            });
        } else {
            console.log('Fetching all messages');
            messagesPrisma = await database.message.findMany({
                include: {
                    user: true,
                    group: { include: { users: true } },
                },
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
        console.log(`Received message ID to fetch: ${id}`);


        if (isNaN(id)) {
            console.error('Invalid ID received:', id);
            throw new Error('Invalid ID');
        }

        console.log(`Fetching message by ID: ${id}`);

        const messagePrisma = await database.message.findUnique({
            where: {
                id: id,
            },
            include: {
                user: true,
                group: { include: { users: true } },
            },
        });

        if (!messagePrisma) {
            console.log(`Message with ID ${id} not found`);
            return null;
        }

        console.log(`Fetched message: ${JSON.stringify(messagePrisma)}`);
        return Message.from(messagePrisma);
    } catch (error) {
        console.error('Error fetching message by ID:', error);
        throw new Error('Database error. See server log for details');
    }
};

const getNewMessages = async (groupId: number, lastTimestamp: string): Promise<Message[]> => {
    try {
        const messagesPrisma = await prisma.message.findMany({
            where: {
                groupId: groupId,
                timestamp: {
                    gt: lastTimestamp, 
                },
            },
            orderBy: {
                timestamp: 'asc', 
            },
            include: {
                user: true,
                group: { include: { users: true } },
            },
        });

        console.log(`Fetched ${messagesPrisma.length} new messages.`);
        
        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        console.error('Error fetching new messages:', error);
        throw new Error('Database error. See server log for details.');
    }
};


export default {
    createMessage,
    getAllMessages,
    getMessageById,
    getNewMessages,
};
