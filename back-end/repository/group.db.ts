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

        const mappedGroup = new Group({
            id,
            name,
            users: users.map(User.from),
            groceryLists: groceryLists ? groceryLists.map(GroceryList.from) : [],
            schedules: schedules ? schedules.map(Schedule.from) : [],
            createdAt,
            updatedAt,
        });

        console.log("[DEBUG] Group.from mapped to domain model:", mappedGroup);
        return mappedGroup;
    };

    const createGroup = async (group: Group): Promise<Group> => {
        try {
            console.log("[INFO] Creating group:", group);

            const usersWithValidIds = group.getUsers().map((user) => {
                const nickname = user.getNickname();
                if (!nickname) {
                    console.error("[ERROR] User ID missing:", user);
                    throw new Error(`User ID is missing for user: ${JSON.stringify(user)}`);
                }
                return { nickname: nickname };
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
                    messages: { include: { user: true } },
                },
            });

            console.log("[DEBUG] Created group data from Prisma:", groupPrisma);
            return Group.from(groupPrisma);
        } catch (error) {
            console.error("[ERROR] Failed to create group:", { error, group });
            throw new Error("Failed to create group. See server logs for details.");
        }
    };

    const getGroupById = async (id: number): Promise<Group | undefined> => {
        try {
            console.log("[INFO] Fetching group by ID:", id);

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
                    messages: { include: { user: true } },
                },
            });

            if (!groupPrisma) {
                console.warn(`[WARNING] No group found with ID: ${id}`);
                return undefined;
            }

            console.log("[DEBUG] Group data fetched from Prisma:", groupPrisma);
            return Group.from(groupPrisma);
        } catch (error) {
            console.error("[ERROR] Failed to fetch group by ID:", { id, error });
            throw new Error("Failed to fetch group by ID. See server logs for details.");
        }
    };

    const getAllGroups = async (): Promise<Group[]> => {
        try {
            console.log("[INFO] Fetching all groups");

            const groupsPrisma = await database.group.findMany({
                include: {
                    users: true,
                    groceryLists: {
                        include: {
                            items: true,
                        },
                    },
                    schedules: true,
                    messages: { include: { user: true } }, 
                },
            });

            console.log("[DEBUG] Fetched groups data from Prisma:", groupsPrisma);
            return groupsPrisma.map(Group.from);
        } catch (error) {
            console.error("[ERROR] Failed to fetch all groups:", error);
            throw new Error("Failed to fetch all groups. See server logs for details.");
        }
    };

    const addUserToGroup = async (groupId: number, userId: number): Promise<Group> => {
        try {
            console.log("[INFO] Adding user to group:", { groupId, userId });

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
                    messages: { include: { user: true } },
                },
            });

            console.log("[DEBUG] Updated group data from Prisma:", updatedGroup);
            return Group.from(updatedGroup);
        } catch (error) {
            console.error("[ERROR] Failed to add user to group:", { groupId, userId, error });
            throw new Error("Failed to add user to group. See server logs for details.");
        }
    };

    const getGroupsOfUser = async (userId: number): Promise<Group[] | undefined> => {
        try {
            console.log("[INFO] Retrieving groups for certain user:", { userId });

            const groupForUser = await database.group.findMany({
                where: { 
                    users: { 
                        some: {
                            id: userId
                        }
                    }
                },
                include: {
                    users: true,
                    groceryLists: {
                        include: {
                            items: true,
                        },
                    },
                    schedules: true,
                    messages: { include: { user: true } }, 
                },
            });

            console.log("[DEBUG] Retrieved group data from Prisma:", groupForUser);
            return groupForUser.map(Group.from);
        } catch (error) {
            console.error("[ERROR] Failed to retrieve groups for user:", { userId, error });
            throw new Error("Failed to retrieve groups for user. See server logs for details.");
        }
    };

    export default { createGroup, getGroupById, getAllGroups, addUserToGroup, getGroupsOfUser};
