import { UserInput } from '../types';
import { User } from '../model/user';

const users: User[] = [];
let userIdCounter = 1;

const createUser = (userData: UserInput): User => {
    if (!userData.name || !userData.email || !userData.nickname) throw new Error('All user fields are required');

    const newUser = new User({
        id: userIdCounter++,
        name: userData.name,
        email: userData.email,
        nickname: userData.nickname,
    });

    users.push(newUser);
    return newUser;
};

const getUserById = (id: number): User | undefined => {
    return users.find(user => user.getId() === id);
};

const getAllUsers = (): User[] => {
    return users;
};

export default { createUser, getUserById, getAllUsers };
