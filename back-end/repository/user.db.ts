import { User } from '../model/user';
import database from './database';
import { User as UserPrisma } from '@prisma/client';

User.from = function ({
    id,
    name,
    email,
    nickname,
    createdAt,
    updatedAt,
}: UserPrisma): User {
    return new User({
        id,
        name,
        email,
        nickname,
        createdAt,
        updatedAt,
    });
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id }
        });
        if (!userPrisma) return null;
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

export default {
    getAllUsers,
    getUserById
};
