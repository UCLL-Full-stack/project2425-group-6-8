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
        const userId = message.getUser().getId();
        if (!userId) {
            throw new Error('User ID is required to create a message');
        }

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

        return Message.from(messagePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllMessages = async (): Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({
            include: { user: true },
        });

        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getMessageById = async (id: number): Promise<Message | null> => {
    try {
        const messagePrisma = await database.message.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!messagePrisma) return null;
        return Message.from(messagePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

export default {
    createMessage,
    getAllMessages,
    getMessageById,
};
