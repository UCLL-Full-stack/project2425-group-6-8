import { User, Item, GroceryList, Schedule, Message, Group } from "../../model";

test('given: valid values for a message, when: message is created, then: message is created with those values', () => {
    // given
    const user = new User({
        name: "Dagobert",
        email: "dagobertduck@gmail.com",
        nickname: "Dago"
    });
    const timestamp = "2024-11-01T10:30:00";
    const messageContent = "Hello, world!";

    // when
    const message = new Message({
        user,
        timestamp,
        message: messageContent
    });

    // then
    expect(message.getUser()).toEqual(user);
    expect(message.getTimestamp()).toEqual(timestamp);
    expect(message.getMessage()).toEqual(messageContent);
});
