import groupDb from '../repository/group.db';
import { Group } from '../model/group';
import UserService from './user.service';
import userDb from '../repository/user.db';

const createGroup = async (groupInput: { name: string; nicknames: string[] }): Promise<Group> => {
    if (!groupInput.name?.trim()) throw new Error('Group name is required');
    if (!groupInput.nicknames || groupInput.nicknames.length === 0) throw new Error('At least one user is required');

    // Resolve users from nicknames
    const existingUsers = await Promise.all(
        groupInput.nicknames.map(async (nickname) => {
            const user = await UserService.getUserByNickName(nickname);
            if (!user) throw new Error(`User with nickname "${nickname}" not found`);
            return user;
        })
    );

    const newGroup = new Group({
        name: groupInput.name,
        userGroups: existingUsers.map(user => ({
            id: 0, // Temporary placeholder
            groupId: 0, // Temporary placeholder
            userId: user.getId()!,
            role: 'GroupAdmin',
        })),
    });
    
    return await groupDb.createGroup(newGroup);
};


const getGroupById = async (id: number): Promise<Group | undefined> => {
    if (!id || id <= 0) throw new Error('Invalid group ID');
    return await groupDb.getGroupById(id);
};

const getAllGroups = async (): Promise<Group[]> => {
    return await groupDb.getAllGroups();
};

const getGroupsOfUser = async (userId: number): Promise<Group[]> => {
    if (!userId || userId <= 0) throw new Error('Invalid user ID');
    return await groupDb.getGroupsOfUser(userId);
};

const addUserToGroup = async (groupId: number, userId: number): Promise<Group> => {
    if (!groupId || groupId <= 0) throw new Error('Invalid group ID');
    if (!userId || userId <= 0) throw new Error('Invalid user ID');

    const group = await groupDb.getGroupById(groupId);
    if (!group) throw new Error(`Group with ID ${groupId} does not exist`);

    const user = await UserService.getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} does not exist`);

    return await groupDb.addUserToGroup(groupId, userId, 'user');
};

const removeUserFromGroup = async (groupId: number, userId: number): Promise<Group> => {
    if (!groupId || groupId <= 0) throw new Error('Invalid group ID');
    if (!userId || userId <= 0) throw new Error('Invalid user ID');

    const group = await groupDb.getGroupById(groupId);
    if (!group) throw new Error(`Group with ID ${groupId} does not exist`);

    const user = await UserService.getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} does not exist`);

    return await groupDb.removeUserFromGroup(groupId, userId);
};

const deleteGroup = async (groupId: number): Promise<Group | undefined> => {
    console.log("THIS IS THE GROUP ID: " + groupId);  
    if (!groupId || groupId <= 0) throw new Error('Invalid group ID');

    const group = await groupDb.getGroupById(groupId);
    if (!group) throw new Error(`Group with ID ${groupId} does not exist`);

    return await groupDb.deleteGroup(groupId);
};


export default {
    createGroup,
    getGroupById,
    getAllGroups,
    getGroupsOfUser,
    addUserToGroup,
    removeUserFromGroup,
    deleteGroup
};
