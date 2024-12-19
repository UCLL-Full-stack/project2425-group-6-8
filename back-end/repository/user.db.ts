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

const assignUserRoleInGroup = async (userId: number, groupId: number, role: Role): Promise<void> => {
    try {
        await database.userGroup.create({
            data: {
                userId,
                groupId,
                role
            }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Failed to assign user role in group. See server log for details.');
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

const getUserByNickName = async (nickname: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
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
    password
}: {
    name?: string;
    nickname: string;
    email?: string;
    password: string;
}): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                name: name ?? '',
                nickname,
                email: email ?? '',
                password
            }
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create user. See server log for details.');
    }
};

const updateUserRoleInGroup = async (userId: number, groupId: number, role: Role): Promise<void> => {
    try {
        await database.userGroup.update({
            where: {
                userId_groupId: { userId, groupId }
            },
            data: { role }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update user role in group. See server log for details.');
    }
};

const getUserGroupsByUserId = async (userId: number): Promise<{ groupId: number; role: Role }[]> => {
    try {
        const userGroups = await database.userGroup.findMany({
            where: { userId },
            select: {
                groupId: true,
                role: true,
            },
        });

        return userGroups.map((userGroup) => ({
            groupId: userGroup.groupId,
            role: userGroup.role as Role, // Cast string to Role enum
        }));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve user groups. See server log for details.');
    }
};


export default {
    getAllUsers,
    getUserById,
    createUser,
    getUserByNickName,
    updateUserRoleInGroup,
    assignUserRoleInGroup,
    getUserGroupsByUserId,
};
