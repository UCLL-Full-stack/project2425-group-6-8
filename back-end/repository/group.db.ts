import { Group, User } from '../model';

const groups: Group[] = [];

const dummyUser1 = new User({
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    nickname: 'alice',
});

const dummyUser2 = new User({
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    nickname: 'bob',
});

const dummyGroup = new Group({
    name: 'Friends Group',
    id: 1,
    users: [dummyUser1, dummyUser2],
});

groups.push(dummyGroup);

const createGroup = (group: Group): Group => {
    groups.push(group);
    console.log('Group created:', group.getName());
    return group;
};

const getAllGroups = (): Group[] => groups;

const getGroupById = (id: number): Group | undefined => {
    return groups.find(group => group.getId() === id);
};

export default { createGroup, getAllGroups, getGroupById };
