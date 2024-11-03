import { GroupInput } from '../types';
import { Group } from '../model/group';
import { User } from '../model';

const groups: Group[] = [];
let groupIdCounter = 1;

const createGroup = (groupData: GroupInput): Group => {
    if (!groupData.name?.trim()) {
        throw new Error('Group name is required');
    }
    if (!groupData.users || groupData.users.length === 0) {
        throw new Error('At least one user is required in the group');
    }
    
    const users: User[] = groupData.users.map(userInput => {
        return new User({
            name: userInput.name,
            email: userInput.email,
            nickname: userInput.nickname
        });
    });

    const newGroup = new Group({
        id: groupIdCounter++,
        name: groupData.name,
        users: users,
    });

    groups.push(newGroup);
    return newGroup;
};


const getGroupById = (id: number): Group | undefined => {
    return groups.find(group => group.getId() === id);
};

const getAllGroups = (): Group[] => {
    return groups;
};

export default { createGroup, getGroupById, getAllGroups };
