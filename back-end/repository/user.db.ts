import { User } from '../model/user';
import database from './database';
import { Role } from '../types';

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
        if (!id) {
            throw new Error('User ID is required and must be a valid number');
        }

        const userPrisma = await database.user.findUnique({
            where: { id },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};


const getUserByNickName = async ({ nickname }: { nickname: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { nickname },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async ({
    name,
    nickname,
    email,
    password,
    role
}: {
    name?: string;
    nickname: string;
    email?: string;
    password: string;
    role?: Role
}): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: { name, nickname, email, password,role },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create user. See server log for details.');
    }
};


export default {
    getAllUsers,
    getUserById,
    createUser,
    getUserByNickName
};
