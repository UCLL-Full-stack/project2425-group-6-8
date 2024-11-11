import { UserInput } from '../types';
import { User } from '../model/user';
import userDb from '../repository/user.db';

const createUser = (userData: UserInput): User => {
    if (!userData.name || !userData.email || !userData.nickname) throw new Error('All user fields are required');

    const newUser = new User({
        name: userData.name,
        email: userData.email,
        nickname: userData.nickname,
    });

    userDb.createUser(newUser);
    return newUser;
};

const getUserById = (id: number): User | null => {
    return userDb.getUserById(id);  
};

const getAllUsers = (): User[] => {
    return userDb.getAllUsers();
};

export default { createUser, getUserById, getAllUsers };
