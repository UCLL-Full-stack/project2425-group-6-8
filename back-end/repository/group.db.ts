import { Group } from '../model/group';
import { User } from '../model/user';
import { GroceryList } from '../model/groceryList';
import { Schedule } from '../model/schedule';
import { Message } from '../model/message';
import database from './database';
import {
    Group as GroupPrisma,
    User as UserPrisma,
    GroceryList as GroceryListPrisma,
    Schedule as SchedulePrisma,
    Message as MessagePrisma,
    Item as ItemPrisma,
} from '@prisma/client';

Group.from = function ({
    id,
    name,
    users,
    groceryLists,
    schedules,
    messages,
    createdAt,
    updatedAt,
}: GroupPrisma & {
    users: UserPrisma[];
    groceryLists?: GroceryListPrisma[];
    schedules?: SchedulePrisma[];
    messages?: MessagePrisma[];
}): Group {
    return new Group({
        id,
        name,
        users: users.map(User.from),
        groceryLists: groceryLists ? groceryLists.map(GroceryList.from) : [],
        schedules: schedules ? schedules.map(Schedule.from) : [],
        createdAt,
        updatedAt,
    });
};

const generateUniqueGroupId = async (): Promise<number> => {
    const generateRandomId = () => Math.floor(100000 + Math.random() * 900000);
    for (let i = 0; i < 5; i++) {
        const randomId = generateRandomId();
        const existingGroup = await database.group.findUnique({ where: { id: randomId } });
        if (!existingGroup) return randomId;
    }
    throw new Error('Failed to generate a unique group ID');
};

const createGroup = async (group: Group): Promise<Group> => {
    const uniqueId = await generateUniqueGroupId();
    const usersWithValidIds = group.getUsers().map((user) => {
        const nickname = user.getNickname();
        if (!nickname) throw new Error(`User ID is missing for user: ${JSON.stringify(user)}`);
        return { nickname };
    });
    const groupPrisma = await database.group.create({
        data: {
            id: uniqueId,
            name: group.getName(),
            users: { connect: usersWithValidIds },
        },
        include: {
            users: true,
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return Group.from(groupPrisma);
};

const getGroupById = async (id: number): Promise<Group | undefined> => {
    const groupPrisma = await database.group.findUnique({
        where: { id },
        include: {
            users: true,
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return groupPrisma ? Group.from(groupPrisma) : undefined;
};

const getAllGroups = async (): Promise<Group[]> => {
    const groupsPrisma = await database.group.findMany({
        include: {
            users: true,
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return groupsPrisma.map(Group.from);
};

const addUserToGroup = async (groupId: number, userId: number): Promise<Group> => {
    const updatedGroup = await database.group.update({
        where: { id: groupId },
        data: { users: { connect: { id: userId } } },
        include: {
            users: true,
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return Group.from(updatedGroup);
};

const getGroupsOfUser = async (userId: number): Promise<Group[] | undefined> => {
    const groupForUser = await database.group.findMany({
        where: { users: { some: { id: userId } } },
        include: {
            users: true,
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return groupForUser.map(Group.from);
};

export default { createGroup, getGroupById, getAllGroups, addUserToGroup, getGroupsOfUser };
