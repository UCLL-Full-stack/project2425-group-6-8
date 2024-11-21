import groupDb from '../repository/group.db';
import { Group } from '../model/group';
import UserService from './user.service';

const createGroup = async (groupInput: { name: string; userIds: number[] }): Promise<Group> => {
    if (!groupInput.name?.trim()) throw new Error('Group name is required');
    if (!groupInput.userIds || groupInput.userIds.length === 0) throw new Error('At least one user is required');

    const existingUsers = await Promise.all(
        groupInput.userIds.map(async (userId) => {
            const user = await UserService.getUserById(userId);
            if (!user) throw new Error(`User with ID ${userId} not found`);
            return user;
        })
    );

    const newGroup = new Group({
        name: groupInput.name,
        users: existingUsers,
    });

    return await groupDb.createGroup(newGroup);
};

const getGroupById = async (id: number): Promise<Group | undefined> => {
    const group = await groupDb.getGroupById(id);
    if (!group) throw new Error(`Group with ID ${id} does not exist`);
    return group;
};

const getAllGroups = async (): Promise<Group[]> => {
    return await groupDb.getAllGroups();
};

export default { createGroup, getGroupById, getAllGroups };
