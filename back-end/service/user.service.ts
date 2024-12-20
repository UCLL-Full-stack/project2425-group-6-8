import { UserInput, AuthenticationResponse } from '../types';
import { User } from '../model/user';
import userDB from '../repository/user.db';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';

const SALT_ROUNDS = 10;

const getAllUsers = async (): Promise<User[]> => {
    return await userDB.getAllUsers();
};

const getUserByNickName = async (nickname: string): Promise<User> => {
    const user = await userDB.getUserByNickName(nickname);
    if (!user) {
        throw new Error(`User with nickname: ${nickname} does not exist.`);
    }
    return user;
};

const createUser = async (userInput: {
    name?: string;
    nickname: string;
    email?: string;
    password: string;
}): Promise<User> => {
    const { name, nickname, email, password } = userInput;

    const existingUser = await userDB.getUserByNickName(nickname);
    if (existingUser) {
        throw new Error(`User with nickname: ${nickname} already exists.`);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await userDB.createUser({
        name,
        nickname,
        email,
        password: hashedPassword,
    });

    return newUser;
};

const getUserById = async (id: number): Promise<User | null> => {
    const user = await userDB.getUserById(id);
    if (!user) {
        throw new Error(`User with ID ${id} not found.`);
    }
    return user;
};

const authenticate = async ({ nickname, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await getUserByNickName(nickname);

    const isValidPassword = await bcrypt.compare(password, user.getPassword());
    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }

    const userId = user.getId() ?? 0;
    const userGroups = await userDB.getUserGroupsByUserId(userId);
    const role = userGroups[0]?.role || 'user';

    return {
        id: user.getId(),
        token: generateJwtToken({ nickname, role }),
        nickname: nickname,
        name: `${user.getName()}`,
        role,
    };
};

export default {
    createUser,
    getUserById,
    getAllUsers,
    getUserByNickName,
    authenticate,
};
