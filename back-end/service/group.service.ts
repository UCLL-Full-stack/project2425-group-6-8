import { GroupInput } from '../types';
import { Group } from '../model/group';
import groupDb from '../repository/group.db';
import UserService from '../service/user.service';

const createGroup = (groupData: GroupInput): Group => {
    if (!groupData.name?.trim()) throw new Error('Group name is required');
    if (!groupData.users || groupData.users.length === 0) throw new Error('At least one user is required');

    const existingUsers = groupData.users.map(userId => {
        const user = UserService.getUserById(userId);
        if (!user) throw new Error(`User with ID ${userId} not found`);
        return user;
    });

    const newGroup = new Group({
        name: groupData.name,
        users: existingUsers,
    });

    groupDb.createGroup(newGroup);
    return newGroup;
};

const getGroupById = (id: number): Group | undefined => {
    return groupDb.getGroupById(id);
};

const getAllGroups = (): Group[] => {
    return groupDb.getAllGroups();
};

export default { createGroup, getGroupById, getAllGroups };
