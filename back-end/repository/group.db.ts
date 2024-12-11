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
        messages: messages ? messages.map(Message.from) : [],
        createdAt,
        updatedAt,
    });
};

const createGroup = async (group: Group): Promise<Group> => {
    try {
        const usersWithValidIds = group.getUsers().map((user) => {
            const userId = user.getId();
            if (!userId) {
                throw new Error(`User ID is missing for user: ${JSON.stringify(user)}`);
            }
            return { id: userId };
        });

        const groupPrisma = await database.group.create({
            data: {
                name: group.getName(),
                users: {
                    connect: usersWithValidIds,
                },
            },
            include: {
                users: true,
                groceryLists: {
                    include: {
                        items: true,
                    },
                },
                schedules: true,
                messages: true,
            },
        });

        return Group.from(groupPrisma);
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create group. See server logs for details.');
    }
};


const getGroupById = async (id: number): Promise<Group | undefined> => {
    try {
        const groupPrisma = await database.group.findUnique({
            where: { id },
            include: {
                users: true,
                groceryLists: {
                    include: {
                        items: true,
                    },
                },
                schedules: true,
                messages: true,
            },
        });

        return groupPrisma ? Group.from(groupPrisma) : undefined;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch group by ID. See server logs for details.');
    }
};

const getAllGroups = async (): Promise<Group[]> => {
    try {
        const groupsPrisma = await database.group.findMany({
            include: {
                users: true,
                groceryLists: {
                    include: {
                        items: true,
                    },
                },
                schedules: true,
                messages: true,
            },
        });

        return groupsPrisma.map(Group.from);
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch all groups. See server logs for details.');
    }
};

const addUserToGroup = async (groupId: number, userId: number): Promise<Group> => {
    try {
        const updatedGroup = await database.group.update({
            where: { id: groupId },
            data: {
                users: {
                    connect: { id: userId },
                },
            },
            include: {
                users: true,
                groceryLists: {
                    include: {
                        items: true,
                    },
                },
                schedules: true,
                messages: true,
            },
        });

        return Group.from(updatedGroup);
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to add user to group. See server logs for details.');
    }
};

export default { createGroup, getGroupById, getAllGroups, addUserToGroup };
