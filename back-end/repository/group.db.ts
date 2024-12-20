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
    UserGroup as UserGroupPrisma,
} from '@prisma/client';

Group.from = function ({
    id,
    name,
    userGroups,
    groceryLists,
    schedules,
    messages,
    createdAt,
    updatedAt,
}: GroupPrisma & {
    userGroups: (UserGroupPrisma & { user: UserPrisma })[];
    groceryLists?: GroceryListPrisma[];
    schedules?: SchedulePrisma[];
    messages?: MessagePrisma[];
}): Group {
    return new Group({
        id,
        name,
        userGroups: userGroups.map((userGroup) => ({
            id: userGroup.id,
            userId: userGroup.userId,
            groupId: userGroup.groupId,
            role: userGroup.role,
            user: User.from(userGroup.user),
        })),
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

    const userGroups = group.getUserGroups();

    if (userGroups.length === 0) {
        throw new Error('A group must have at least one user.');
    }

    const groupPrisma = await database.group.create({
        data: {
            id: uniqueId,
            name: group.getName(),
            userGroups: {
                create: userGroups.map((userGroup, index) => ({
                    userId: userGroup.userId,
                    role: index === 0 ? "GroupAdmin" : "user", 
                })),
            },
        },
        include: {
            userGroups: { include: { user: true } },
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });

    return Group.from({
        ...groupPrisma,
        userGroups: groupPrisma.userGroups.map((userGroup) => ({
            ...userGroup,
            id: userGroup.id,
            groupId: userGroup.groupId,
        })),
    });
};




const getGroupById = async (id: number): Promise<Group | undefined> => {
    const groupPrisma = await database.group.findUnique({
        where: { id },
        include: {
            userGroups: { include: { user: true } },
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
            userGroups: { include: { user: true } },
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return groupsPrisma.map(Group.from);
};

const addUserToGroup = async (groupId: number, userId: number, role: string): Promise<Group> => {
    const updatedGroup = await database.group.update({
        where: { id: groupId },
        data: {
            userGroups: {
                create: { userId, role },
            },
        },
        include: {
            userGroups: { include: { user: true } },
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return Group.from(updatedGroup);
};

const removeUserFromGroup = async (groupId: number, userId: number): Promise<Group> => {
    const updatedGroup = await database.group.update({
        where: { id: groupId },
        data: {
            userGroups: {
                deleteMany: { userId, groupId },
            },
        },
        include: {
            userGroups: { include: { user: true } },
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return Group.from(updatedGroup);
};

const getGroupsOfUser = async (userId: number): Promise<Group[]> => {
    const groupsForUser = await database.group.findMany({
        where: { userGroups: { some: { userId } } },
        include: {
            userGroups: { include: { user: true } },
            groceryLists: { include: { items: true } },
            schedules: true,
            messages: { include: { user: true } },
        },
    });
    return groupsForUser.map(Group.from);
};



const deleteGroup = async (groupId: number): Promise<Group | undefined> => {
    const groupPrisma = await database.group.findUnique({
        where: { id: groupId },
        include: {
            userGroups: true,
            groceryLists: true,
            schedules: true,
            messages: true,
        },
    });

    if (!groupPrisma) {
        throw new Error('Group not found');
    }

    const userGroupsDeletion = groupPrisma.userGroups.length > 0
        ? database.userGroup.deleteMany({ where: { groupId } })
        : Promise.resolve(); 

    const groceryListsDeletion = groupPrisma.groceryLists.length > 0
        ? database.groceryList.deleteMany({ where: { groupId } })
        : Promise.resolve(); 

    const messagesDeletion = groupPrisma.messages.length > 0
        ? database.message.deleteMany({ where: { groupId } })
        : Promise.resolve();

    await Promise.all([userGroupsDeletion, groceryListsDeletion, messagesDeletion]);
    await database.group.delete({
        where: { id: groupId },
    });
    return Group.from(groupPrisma);
};

export default {
    createGroup,
    getGroupById,
    getAllGroups,
    addUserToGroup,
    removeUserFromGroup,
    getGroupsOfUser,
    deleteGroup, 
};
