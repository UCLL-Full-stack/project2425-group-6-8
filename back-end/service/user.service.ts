import { UserInput } from '../types';
import { User } from '../model/user';
import userRepository from '../repository/user.db';

const createUser = async (userData: UserInput): Promise<User> => {
    if (!userData.name || !userData.email || !userData.nickname) {
        throw new Error('All user fields are required');
    }

    const newUser = new User({
        name: userData.name,
        email: userData.email,
        nickname: userData.nickname,
    });

    return userRepository.createUser(newUser);
};

const getUserById = async (id: number): Promise<User | null> => {
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error(`User with ID ${id} not found`);
    return user;
};

const getAllUsers = async (): Promise<User[]> => {
    return userRepository.getAllUsers();
};

export default {
    createUser,
    getUserById,
    getAllUsers,
};
