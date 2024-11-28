import { UserInput } from '../types';
import { User } from '../model/user';
import userDB from '../repository/user.db';
import bcrypt from 'bcrypt';
import { generateJWTtoken } from '../util/jwt';
import { AuthenticationResponse } from '../types/index';

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
 * @param username - The username of the user.
 * @param password - The entered password.
 * @returns An AuthenticationResponse containing username, token, and fullname.
 */
const authenticate = async (userInput: UserInput): Promise<AuthenticationResponse> => {
    const { nickname, password } = userInput;
    
    const user = await userDB.getUserByNickName({ nickname });
    if (!user) {
        throw new Error('User does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    // Generate JWT token with role
    const token = generateJWTtoken(nickname);

    return {
        nickname,
        token,
        fullname: `${user.getName()}`,
    };
};

export default {
    createUser,
    getUserById,
    getAllUsers,
    getUserByNickName,
    authenticate,
    generateJWTtoken,
};
