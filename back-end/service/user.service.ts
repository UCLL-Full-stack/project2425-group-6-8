import { UserInput } from '../types';
import { User } from '../model/user';
import userDB from '../repository/user.db';
import bcrypt from 'bcrypt';

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

export default {
    createUser,
    getUserById,
    getAllUsers,
    getUserByNickName
};
