import { User, Item, GroceryList, Schedule, Message, Group } from "../../model";

describe('User Tests', () => {
    test('given: valid user data, when: User is created, then: user is created with those values', () => {
        // Given

        // When
        const user = new User({
                name: 'gabe',
                email: 'gabe@gmail.com',
                nickname: 'testuser',
                password: '@Crazygabe123',
                globalRole: 'user',
            });

        // Then
        expect(user.getNickname()).toBe('testuser');
        expect(user.getRole()).toBe('user');
    });

    test('given: missing nickname, when: User is created, then: it throws an error', () => {
        // Given

        // When / Then
        expect(() => {
            new User({
                name: 'gabe',
                email: 'gabe@gmail.com',
                nickname: ' ',
                password: '@Crazygabe123',
                globalRole: 'user',
                });
        }).toThrowError('Nickname is required');
    });

    test('given: invalid email, when: User is created, then: it throws an error', () => {
        // Given

        // When / Then
        expect(() => {
            new User({
                name: 'gabe',
                email: 'bademail',
                nickname: 'testuser',
                password: '@Crazygabe123',
                globalRole: 'user',
                });
        }).toThrowError('Email is not valid');
    });

    test('given: missing password, when: User is created, then: it throws an error', () => {
        // Given

        // When / Then
        expect(() => {
            new User({
                name: 'gabe',
                email: 'gabe@gmail.com',
                nickname: 'testuser',
                password: ' ',
                globalRole: 'user',
                });
        }).toThrowError('Password is required');
    });
});