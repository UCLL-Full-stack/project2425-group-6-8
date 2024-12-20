import { User, Group, Message } from "../../model";

describe('Message Tests', () => {
    test('given: valid message data, when: Message is created, then: message is created with those values', () => {
        // Given: User
        const user = new User({
            name: 'gabe',
                email: 'gabe@gmail.com',
                nickname: 'testuser',
                password: '@Crazygabe123',
                globalRole: 'user',
        });

        // Given: Group
        const group = new Group({
            name: 'Test Group',
            userGroups: [
                { id: 1, userId: 1, groupId: 1, role: 'Admin' },
            ],
        });
        // Given: Timestamp for the message
        const timestamp = new Date();

        // Given: Message content
        const message = 'Hello, World!';

        // When: Creating a new message instance
        const newMessage = new Message({
            user,
            group,
            timestamp,
            message,
        });

        // Then: Check that the message is created with the correct values
        expect(newMessage.getUser()).toBe(user);
        expect(newMessage.getGroup()).toBe(group);
        expect(newMessage.getTimestamp()).toBe(timestamp);
        expect(newMessage.getMessage()).toBe(message);
    });

    test('given: missing message content, when: Message is created, then: it throws an error', () => {
        // Given
        const user = new User({
            name: 'gabe',
                email: 'gabe@gmail.com',
                nickname: 'testuser',
                password: '@Crazygabe123',
                globalRole: 'user',
        });
        const group = new Group({
            name: 'Test Group',
            userGroups: [
                { id: 1, userId: 1, groupId: 1, role: 'Admin' },
            ],
        });
        const messageData = {
            user,
            group,
            timestamp: new Date(),
            message: '',
        };

        // When / Then
        expect(() => {
            new Message(messageData);
        }).toThrowError('Message content is required');
    });
});
