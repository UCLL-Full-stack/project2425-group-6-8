import { User, Item, GroceryList, Schedule, Message, Group } from "../../model";

test('given: valid values for a user, when: user is created, then: user is created with those values', () => {
    // given
    const name = "Dagobert";
    const email = "dagobertduck@gmail.com";
    const nickname = "Dago";

    // when
    const user = new User({
        name,
        email,
        nickname
    });

    // then
    expect(user.getName()).toEqual(name);
    expect(user.getEmail()).toEqual(email);
    expect(user.getNickname()).toEqual(nickname);
});

