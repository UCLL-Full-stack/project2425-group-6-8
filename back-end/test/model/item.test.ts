import { User, Item, GroceryList, Schedule, Message, Group } from "../../model";
import { ConsumableType } from "../../model/consumableTypeEnum";


test('given: valid values for an item, when: item is created, then: item is created with those values', () => {
//given valid values
const name = "Red Velvet Cake";
    const description = "Quite eligible and delicious";
    const consumableType = ConsumableType.Food;
    const price = 19.99;

//when
const item = new Item({
    name,
    description,
    consumableType,
    price
});

//then
expect(item.getName()).toEqual(name);
expect(item.getDescription()).toEqual(description);
expect(item.getConsumableType()).toEqual(consumableType);
expect(item.getPrice()).toEqual(price);

})