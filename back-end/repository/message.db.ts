import { Message as MessagePrisma, User as UserPrisma } from '@prisma/client';
import { Message } from '../model';
import { User } from '../model/user';
import database from './database';

Message.from = function ({
    id,
    user,
    timestamp,
    message,
    createdAt,
    updatedAt,
}: MessagePrisma & { user: UserPrisma }): Message {
    console.log('Message.from service called with data:', {
        id,
        user,
        timestamp,
        message,
        createdAt,
        updatedAt,
    });

    return new Message({
        id,
        user: User.from(user),
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
        if (!userId) {
            console.error('User ID is required to create a message');
            throw new Error('User ID is required to create a message');
        }

        console.log(`Creating message for user ID: ${userId}`);

        const messagePrisma = await database.message.create({
            data: {
                userId: userId,
                timestamp: message.getTimestamp(),
                message: message.getMessage(),
                createdAt: message.getCreatedAt(),
                updatedAt: message.getUpdatedAt(),
            },
            include: {
                user: true,
            },
        });

        console.log('Message created in database:', messagePrisma);
        return Message.from(messagePrisma);
    } catch (error) {
        console.error('Error creating message:', error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllMessages = async (): Promise<Message[]> => {
    try {
        console.log('Fetching all messages');

        const messagesPrisma = await database.message.findMany({
            include: { user: true },
        });

        console.log(`Fetched ${messagesPrisma.length} messages from database`);
        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        console.error('Error fetching all messages:', error);
        throw new Error('Database error. See server log for details');
    }
};

const getMessageById = async (id: number): Promise<Message | null> => {
    try {
        console.log(`Fetching message by ID: ${id}`);

        const messagePrisma = await database.message.findUnique({
            where: { id },
            include: { user: true },
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

export default {
    createMessage,
    getAllMessages,
    getMessageById,
};
