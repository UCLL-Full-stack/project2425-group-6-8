import { GroupInput } from '../types';
import { Group } from '../model/group';

const groups: Group[] = [];
let groupIdCounter = 1;

const createGroup = (groupData: GroupInput): Group => {
    if (!groupData.name) throw new Error('Group name is required');

    const newGroup = new Group({
        id: groupIdCounter++,
        name: groupData.name,
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
