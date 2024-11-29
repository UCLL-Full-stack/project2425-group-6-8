import { UserInput, Role } from '../types';
import { User } from '../model/user';
import userDB from '../repository/user.db';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';
import { AuthenticationResponse } from '../types/index';
import { UnauthorizedError } from 'express-jwt';

const SALT_ROUNDS = 10;

const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();

const getUserByNickName = async ({ nickname }: { nickname: string }): Promise<User> => {
    const user = await userDB.getUserByNickName({ nickname });
    if (!user) {
        throw new Error(`User with username: ${name} does not exist.`);
    }
    return user;
};

const createUser = async (userInput: {
    name?: string;
    nickname: string;
    email?: string;
    password: string;
    role?: Role;
}): Promise<User> => {
    const { name, nickname, email, password } = userInput;

    // Step 1: Check if user already exists
    const existingUser = await userDB.getUserByNickName({ nickname });
    if (existingUser) {
        throw new Error(`User with username: ${name} already exists.`);
    }

    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Step 3: Create the user in the database
    const newUser = await userDB.createUser({
        name,
        nickname,
        email,
        password: hashedPassword,
        role: 'user',
    });

    return newUser;
};

const getUserById = async (id: number): Promise<User | null> => {
    const user = await userDB.getUserById(id);
    if (!user) throw new Error(`User with ID ${id} not found`);
    return user;
};

/**
 * Authenticates a user by username and password.
 * @param nickname - The username of the user.
 * @param password - The entered password.
 * @returns An AuthenticationResponse containing username, token, and fullname.
 */
const authenticate = async ({ nickname, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await getUserByNickName({ nickname });

    const isValidPassword = await bcrypt.compare(password, user.getPassword());

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }
    return {
        token: generateJwtToken({ nickname, role: user.getRole() }),
        nickname: nickname,
        name: `${user.getName()}`,
        role: user.getRole(),
    };
};

export default {
    createUser,
    getUserById,
    getAllUsers,
    getUserByNickName,
    authenticate,
    generateJwtToken,
};
