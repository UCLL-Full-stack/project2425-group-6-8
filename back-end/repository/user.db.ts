import { User } from '../model/user';

const users: User[] = [
    new User({
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        nickname: 'alice',
    }),
    new User({
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        nickname: 'bobby',
    }),
    new User({
        id: 3,
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        nickname: 'charlie',
    }),
    new User({
        id: 4,
        name: 'Diana Prince',
        email: 'diana.prince@example.com',
        nickname: 'diana',
    }),
];

const createUser = (user: User): User => {
    users.push(user);
    return user;
};

const getAllUsers = (): User[] => users;

const getUserById = (id: number): User | null => {
    return users.find(user => user.getId() === id) || null;
};

export default { createUser, getAllUsers, getUserById };
