import { User, Item, GroceryList, Schedule, Message, Group } from "../../model";


test('given: valid values for a groceryList, when: groceryList is created, then: groceryList is created with those values', () => {
    // Given
    const name = "Best group you is ever gunna see";
    const user = new User({ name: "Dagobert", email: "dagobertduck@gmail.com", nickname: "Dago" });

    // When
    const group = new Group({ name, user }); 

    // Then
    expect(group.getName()).toEqual(name);
    expect(group.getUser()).toEqual(user); 
});