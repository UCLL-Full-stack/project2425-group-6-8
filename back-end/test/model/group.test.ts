import { Group } from '../../model/group';
import { UserGroup as UserGroupPrisma } from '@prisma/client';

describe('Group Tests', () => {
    test('given: valid group data, when: Group is created, then: group is created with those values', () => {
        // Given
        const groupData = {
            name: 'Test Group',
            userGroups: [
                { id: 1, userId: 1, groupId: 1, role: 'Admin' },
            ] as UserGroupPrisma[],
        };

        // When
        const group = new Group(groupData);

        // Then
        expect(group.getName()).toBe('Test Group');
        expect(group.getUserGroups().length).toBe(1);
    });

    test('given: missing name, when: Group is created, then: it throws an error', () => {
        // Given
        const groupData = {
            name: '',
            userGroups: [
                { id: 1, userId: 1, groupId: 1, role: 'Admin' },
            ] as UserGroupPrisma[],
        };

        // When / Then
        expect(() => {
            new Group(groupData);
        }).toThrowError('Group name is required');
    });

    test('given: no users in group, when: Group is created, then: it throws an error', () => {
        // Given
        const groupData = {
            name: 'Test Group',
            userGroups: [] as UserGroupPrisma[],
        };

        // When / Then
        expect(() => {
            new Group(groupData);
        }).toThrowError('Group must contain at least one user');
    });
});
