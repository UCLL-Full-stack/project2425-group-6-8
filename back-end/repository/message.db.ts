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
        const user = message.getUser();
        const group = message.getGroup();

        const userId = user ? user.getId() : null;
        const groupId = group ? group.getId() : null;

        if (!userId) {
            throw new Error('User ID is required to create a message');
        }

        if (!groupId) {
            throw new Error('Group ID is required to create a message');
        }

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

        return Message.from(messagePrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const getAllMessages = async (groupId?: number): Promise<Message[]> => {
    try {
        let messagesPrisma;

        if (groupId) {
            messagesPrisma = await database.message.findMany({
                where: { groupId },
                include: {
                    user: true,
                    group: { include: { users: true } },
                },
            });
        } else {
            messagesPrisma = await database.message.findMany({
                include: {
                    user: true,
                    group: { include: { users: true } },
                },
            });
        }

        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        throw new Error('Database error. See server log for details');
    }
};

const getMessageById = async (id: number): Promise<Message | null> => {
    try {
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
            return null;
        }

        return Message.from(messagePrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details');
    }
};

const getNewMessages = async (groupId: number, lastTimestamp: string): Promise<Message[]> => {
    try {
        const parsedTimestamp = new Date(lastTimestamp);

        if (isNaN(parsedTimestamp.getTime())) {
            throw new Error('Invalid timestamp format.');
        }

        const messagesPrisma = await prisma.message.findMany({
            where: {
                groupId: groupId,
                timestamp: {
                    gt: parsedTimestamp,
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

        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        throw new Error('Failed to fetch new messages. See server log for details.');
    }
};

export default {
    createMessage,
    getAllMessages,
    getMessageById,
    getNewMessages,
};
